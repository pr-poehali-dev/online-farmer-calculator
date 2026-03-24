import os
import json
import datetime
import urllib.request
import urllib.error
import base64
import hmac
import hashlib
import time


def get_access_token(service_account_email: str, private_key_pem: str) -> str:
    """Получаем OAuth2 токен через JWT для Google API."""
    header = base64.urlsafe_b64encode(json.dumps({"alg": "RS256", "typ": "JWT"}).encode()).rstrip(b"=").decode()
    now = int(time.time())
    payload = {
        "iss": service_account_email,
        "scope": "https://www.googleapis.com/auth/spreadsheets",
        "aud": "https://oauth2.googleapis.com/token",
        "exp": now + 3600,
        "iat": now,
    }
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b"=").decode()
    signing_input = f"{header}.{payload_b64}".encode()

    from cryptography.hazmat.primitives import hashes, serialization
    from cryptography.hazmat.primitives.asymmetric import padding

    private_key = serialization.load_pem_private_key(private_key_pem.encode(), password=None)
    signature = private_key.sign(signing_input, padding.PKCS1v15(), hashes.SHA256())
    sig_b64 = base64.urlsafe_b64encode(signature).rstrip(b"=").decode()
    jwt_token = f"{header}.{payload_b64}.{sig_b64}"

    data = urllib.parse.urlencode({
        "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
        "assertion": jwt_token,
    }).encode()

    import urllib.parse
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())["access_token"]


def append_to_sheet(token: str, sheet_id: str, values: list):
    """Добавляем строку в Google Sheets."""
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS"
    body = json.dumps({"values": [values]}).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read())


def ensure_header(token: str, sheet_id: str):
    """Проверяем и создаём заголовок таблицы если нужно."""
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}/values/A1:Z1"
    req = urllib.request.Request(
        url,
        headers={"Authorization": f"Bearer {token}"},
        method="GET",
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read())

    if not data.get("values"):
        headers = [
            "Дата", "Площадь (га)", "Семена (₽)", "Удобрения (₽)", "СЗР (₽)",
            "Топливо (₽)", "Труд (₽)", "Аренда (₽)", "Амортизация (₽)", "Прочее (₽)",
            "Урожайность (кг/га)", "Цена (₽/кг)", "Объём (кг)", "Выручка (₽)",
            "Затраты (₽)", "Прибыль (₽)", "Рентабельность (%)", "Себест. 1 кг (₽)",
            "Точка безуб. (кг)",
        ]
        append_to_sheet(token, sheet_id, headers)


def handler(event: dict, context) -> dict:
    """Сохраняет результаты расчёта калькулятора в Google Таблицу."""
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")

    service_account_email = os.environ["GOOGLE_SERVICE_ACCOUNT_EMAIL"]
    private_key = os.environ["GOOGLE_PRIVATE_KEY"].replace("\\n", "\n")
    sheet_id = os.environ["GOOGLE_SHEET_ID"]

    token = get_access_token(service_account_email, private_key)
    ensure_header(token, sheet_id)

    costs = body.get("costs", {})
    calc = body.get("calc", {})

    now = datetime.datetime.now().strftime("%d.%m.%Y %H:%M")

    row = [
        now,
        body.get("area", ""),
        costs.get("seeds", ""),
        costs.get("fertilizers", ""),
        costs.get("pesticides", ""),
        costs.get("fuel", ""),
        costs.get("labor", ""),
        costs.get("rent", ""),
        costs.get("equipment", ""),
        costs.get("other", ""),
        body.get("yield_", ""),
        body.get("price", ""),
        calc.get("totalProduction", ""),
        calc.get("revenue", ""),
        calc.get("totalCosts", ""),
        calc.get("profit", ""),
        round(calc.get("margin", 0), 2),
        round(calc.get("costPerUnit", 0), 2),
        round(calc.get("breakeven", 0), 2),
    ]

    append_to_sheet(token, sheet_id, row)

    return {
        "statusCode": 200,
        "headers": {**cors_headers, "Content-Type": "application/json"},
        "body": json.dumps({"ok": True, "message": "Расчёт сохранён в Google Таблицу"}),
    }
