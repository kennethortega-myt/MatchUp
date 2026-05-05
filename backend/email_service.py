import os
import secrets

import resend

REQUIRE_VERIFICATION = os.getenv("REQUIRE_EMAIL_VERIFICATION", "false").lower() == "true"
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
MAIL_FROM      = os.getenv("MAIL_FROM", "MatchUp <onboarding@resend.dev>")
FRONTEND_URL   = os.getenv("FRONTEND_URL", "http://localhost:5173")


def generate_token() -> str:
    return secrets.token_urlsafe(32)


async def send_reset_email(to_email: str, token: str) -> None:
    if not RESEND_API_KEY:
        print(f"[DEV] Password reset link for {to_email}: {FRONTEND_URL}/reset-password?token={token}")
        return

    resend.api_key = RESEND_API_KEY
    link = f"{FRONTEND_URL}/reset-password?token={token}"
    try:
        resend.Emails.send({
            "from": MAIL_FROM,
            "to": [to_email],
            "subject": "Restablecer contraseña en MatchUp",
            "html": f"""
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
        })
        print(f"[EMAIL] Reset email sent to {to_email}")
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send reset email to {to_email}: {e}")
        raise


async def send_verification_email(to_email: str, token: str) -> None:
    if not RESEND_API_KEY:
        print(f"[DEV] Verification link for {to_email}: {FRONTEND_URL}/verify-email?token={token}")
        return

    resend.api_key = RESEND_API_KEY
    link = f"{FRONTEND_URL}/verify-email?token={token}"
    try:
        resend.Emails.send({
            "from": MAIL_FROM,
            "to": [to_email],
            "subject": "Verifica tu cuenta en MatchUp",
            "html": f"""
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
        })
        print(f"[EMAIL] Verification email sent to {to_email}")
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send verification email to {to_email}: {e}")
        raise
