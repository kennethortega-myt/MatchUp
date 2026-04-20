interface Props {
  onClose: () => void
}

export default function PrivacyPolicyModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Política de Privacidad</h2>
            <p className="text-xs text-gray-400">MatchUp · Última actualización: Abril 2026</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">×</button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-sm text-gray-600 leading-relaxed">

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">1. Responsable del tratamiento</h3>
            <p>MatchUp es responsable del tratamiento de tus datos personales. Puedes contactarnos en <span className="text-pink-500 font-medium">soporte@matchup.app</span> para cualquier consulta sobre privacidad.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">2. Datos que recopilamos</h3>
            <ul className="space-y-1 list-none">
              {[
                ['📧', 'Correo electrónico — para identificación y comunicación'],
                ['👤', 'Datos de perfil — nombre, edad, ciudad, ocupación, biografía'],
                ['📸', 'Fotos de perfil — almacenadas de forma segura en nuestros servidores'],
                ['📱', 'Datos de contacto opcionales — teléfono e Instagram (solo visibles tras match)'],
                ['🔐', 'Datos de uso — actividad en la plataforma, solicitudes enviadas y recibidas'],
              ].map(([icon, text]) => (
                <li key={text as string} className="flex items-start gap-2">
                  <span className="mt-0.5 flex-shrink-0">{icon}</span>
                  <span>{text as string}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">3. Finalidad del tratamiento</h3>
            <p>Usamos tus datos exclusivamente para:</p>
            <ul className="mt-1.5 space-y-1 list-disc list-inside">
              <li>Gestionar tu cuenta y autenticación</li>
              <li>Mostrar tu perfil a otros usuarios dentro de la plataforma</li>
              <li>Procesar solicitudes de match y regalos</li>
              <li>Enviarte notificaciones relacionadas con tu cuenta</li>
              <li>Mejorar la seguridad y funcionamiento del servicio</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">4. Base legal</h3>
            <p>El tratamiento se basa en el <strong>consentimiento</strong> que otorgas al registrarte, y en la <strong>ejecución del contrato</strong> de servicio que aceptas al usar la plataforma.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">5. Compartición de datos</h3>
            <p>No vendemos ni compartimos tus datos con terceros con fines comerciales. Solo compartimos información con:</p>
            <ul className="mt-1.5 space-y-1 list-disc list-inside">
              <li>Proveedores de infraestructura (alojamiento, base de datos) bajo acuerdos de confidencialidad</li>
              <li>Autoridades legales, solo cuando sea requerido por ley</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">6. Conservación de datos</h3>
            <p>Conservamos tus datos mientras tu cuenta esté activa. Al eliminar tu cuenta, tus datos personales son eliminados en un plazo máximo de 30 días, salvo obligación legal.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">7. Tus derechos</h3>
            <p>Tienes derecho a <strong>acceder, rectificar, eliminar, portar y oponerte</strong> al tratamiento de tus datos. Para ejercerlos, escríbenos a <span className="text-pink-500 font-medium">soporte@matchup.app</span>.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">8. Seguridad</h3>
            <p>Implementamos medidas técnicas y organizativas para proteger tus datos: cifrado en tránsito (HTTPS/TLS), contraseñas hasheadas con bcrypt, datos sensibles cifrados en reposo, y acceso restringido a la información personal.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">9. Menores de edad</h3>
            <p>MatchUp está destinado exclusivamente a personas mayores de 18 años. No recopilamos intencionalmente datos de menores.</p>
          </section>

          <section>
            <h3 className="font-bold text-gray-800 mb-1.5">10. Cambios en esta política</h3>
            <p>Podemos actualizar esta política ocasionalmente. Te notificaremos por email ante cambios significativos.</p>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}
