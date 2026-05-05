import os
import secrets

REQUIRE_VERIFICATION = os.getenv("REQUIRE_EMAIL_VERIFICATION", "false").lower() == "true"
MAIL_USERNAME = os.getenv("MAIL_USERNAME", "")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "")
MAIL_FROM     = os.getenv("MAIL_FROM", "") or MAIL_USERNAME
MAIL_SERVER   = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT     = int(os.getenv("MAIL_PORT", "587"))
FRONTEND_URL  = os.getenv("FRONTEND_URL", "http://localhost:5173")


def generate_token() -> str:
    return secrets.token_urlsafe(32)


async def send_reset_email(to_email: str, token: str) -> None:
    if not MAIL_USERNAME:
        print(f"[DEV] Password reset link for {to_email}: {FRONTEND_URL}/reset-password?token={token}")
        return

    from fastapi_mail import FastMail, MessageSchema, MessageType, ConnectionConfig

    conf = ConnectionConfig(
        MAIL_USERNAME=MAIL_USERNAME,
        MAIL_PASSWORD=MAIL_PASSWORD,
        MAIL_FROM=MAIL_FROM,
        MAIL_SERVER=MAIL_SERVER,
        MAIL_PORT=MAIL_PORT,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )

    link = f"{FRONTEND_URL}/reset-password?token={token}"
    message = MessageSchema(
        subject="Restablecer contraseña en MatchUp",
        recipients=[to_email],
        body=f"""
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff">
          <h2 style="color:#ec4899;margin-bottom:8px">Restablecer contraseña</h2>
          <p style="color:#555;margin-bottom:24px">
            Haz clic en el botón para crear una nueva contraseña. El enlace expira en 1 hora.
          </p>
          <a href="{link}"
             style="display:inline-block;background:#ec4899;color:white;padding:14px 28px;
                    border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px">
            Restablecer contraseña
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px">
            Si no solicitaste esto, ignora este email.
          </p>
        </div>
        """,
        subtype=MessageType.html,
    )
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        print(f"[EMAIL] Reset email sent to {to_email}")
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send reset email to {to_email}: {e}")
        raise


async def send_verification_email(to_email: str, token: str) -> None:
    if not MAIL_USERNAME:
        print(f"[DEV] Verification link for {to_email}: {FRONTEND_URL}/verify-email?token={token}")
        return

    from fastapi_mail import FastMail, MessageSchema, MessageType, ConnectionConfig

    conf = ConnectionConfig(
        MAIL_USERNAME=MAIL_USERNAME,
        MAIL_PASSWORD=MAIL_PASSWORD,
        MAIL_FROM=MAIL_FROM,
        MAIL_SERVER=MAIL_SERVER,
        MAIL_PORT=MAIL_PORT,
        MAIL_STARTTLS=True,
        MAIL_SSL_TLS=False,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True,
    )

    link = f"{FRONTEND_URL}/verify-email?token={token}"
    message = MessageSchema(
        subject="Verifica tu cuenta en MatchUp",
        recipients=[to_email],
        body=f"""
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff">
          <h2 style="color:#ec4899;margin-bottom:8px">¡Bienvenido a MatchUp!</h2>
          <p style="color:#555;margin-bottom:24px">
            Haz clic en el botón para verificar tu correo y activar tu cuenta:
          </p>
          <a href="{link}"
             style="display:inline-block;background:#ec4899;color:white;padding:14px 28px;
                    border-radius:10px;text-decoration:none;font-weight:bold;font-size:15px">
            Verificar mi cuenta
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px">
            Si no te registraste en MatchUp, ignora este email.<br>
            El enlace expira en 24 horas.
          </p>
        </div>
        """,
        subtype=MessageType.html,
    )
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        print(f"[EMAIL] Verification email sent to {to_email}")
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send verification email to {to_email}: {e}")
        raise
