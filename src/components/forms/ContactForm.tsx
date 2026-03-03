import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

type Locale = 'it' | 'en' | 'de' | 'fr' | 'es';

const translations: Record<Locale, Record<string, string>> = {
  it: {
    name: 'Nome e cognome',
    namePlaceholder: 'Mario Rossi',
    email: 'Email',
    emailPlaceholder: 'nome@hotel.it',
    message: 'Messaggio',
    messagePlaceholder: 'Come possiamo aiutarLa?',
    privacy: 'Acconsento al trattamento dei miei dati personali secondo l\'informativa privacy.',
    submit: 'Invia messaggio',
    required: 'Questo campo e obbligatorio',
    invalidEmail: 'Inserire un indirizzo email valido',
    minLength: 'Inserire almeno 2 caratteri',
    maxLength: 'Il campo non puo superare 500 caratteri',
    success: 'Grazie per averci contattato. Ricevera una risposta entro 24 ore lavorative.',
    error: 'Si e verificato un errore. Riprovare o contattare supporto@sginformatica.com',
    sending: 'Invio in corso...',
  },
  en: {
    name: 'Full name',
    namePlaceholder: 'John Smith',
    email: 'Email',
    emailPlaceholder: 'name@hotel.com',
    message: 'Message',
    messagePlaceholder: 'How can we help you?',
    privacy: 'I consent to the processing of my personal data according to the privacy policy.',
    submit: 'Send message',
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    minLength: 'Please enter at least 2 characters',
    maxLength: 'This field cannot exceed 500 characters',
    success: 'Thank you for contacting us. You will receive a response within 24 business hours.',
    error: 'An error occurred. Please try again or contact supporto@sginformatica.com',
    sending: 'Sending...',
  },
  de: {
    name: 'Vor- und Nachname',
    namePlaceholder: 'Max Mustermann',
    email: 'E-Mail',
    emailPlaceholder: 'name@hotel.de',
    message: 'Nachricht',
    messagePlaceholder: 'Wie koennen wir Ihnen helfen?',
    privacy: 'Ich stimme der Verarbeitung meiner personenbezogenen Daten gemaess der Datenschutzerklaerung zu.',
    submit: 'Nachricht senden',
    required: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Bitte geben Sie eine gueltige E-Mail-Adresse ein',
    minLength: 'Bitte geben Sie mindestens 2 Zeichen ein',
    maxLength: 'Dieses Feld darf 500 Zeichen nicht ueberschreiten',
    success: 'Vielen Dank fuer Ihre Kontaktaufnahme. Sie erhalten innerhalb von 24 Geschaeftsstunden eine Antwort.',
    error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie supporto@sginformatica.com',
    sending: 'Wird gesendet...',
  },
  fr: {
    name: 'Nom complet',
    namePlaceholder: 'Jean Dupont',
    email: 'E-mail',
    emailPlaceholder: 'nom@hotel.fr',
    message: 'Message',
    messagePlaceholder: 'Comment pouvons-nous vous aider ?',
    privacy: 'J\'accepte le traitement de mes donnees personnelles conformement a la politique de confidentialite.',
    submit: 'Envoyer le message',
    required: 'Ce champ est obligatoire',
    invalidEmail: 'Veuillez saisir une adresse e-mail valide',
    minLength: 'Veuillez saisir au moins 2 caracteres',
    maxLength: 'Ce champ ne peut pas depasser 500 caracteres',
    success: 'Merci de nous avoir contactes. Vous recevrez une reponse dans les 24 heures ouvrees.',
    error: 'Une erreur est survenue. Veuillez reessayer ou contacter supporto@sginformatica.com',
    sending: 'Envoi en cours...',
  },
  es: {
    name: 'Nombre completo',
    namePlaceholder: 'Juan Garcia',
    email: 'E-mail',
    emailPlaceholder: 'nombre@hotel.es',
    message: 'Mensaje',
    messagePlaceholder: 'Como podemos ayudarle?',
    privacy: 'Consiento el tratamiento de mis datos personales de acuerdo con la politica de privacidad.',
    submit: 'Enviar mensaje',
    required: 'Este campo es obligatorio',
    invalidEmail: 'Introduzca una direccion de e-mail valida',
    minLength: 'Introduzca al menos 2 caracteres',
    maxLength: 'Este campo no puede superar 500 caracteres',
    success: 'Gracias por contactarnos. Recibira una respuesta en un plazo de 24 horas laborables.',
    error: 'Se ha producido un error. Intentelo de nuevo o contacte con supporto@sginformatica.com',
    sending: 'Enviando...',
  },
};

function getSchema(t: Record<string, string>) {
  return z.object({
    name: z.string().min(2, t.minLength),
    email: z.string().email(t.invalidEmail),
    message: z.string().min(2, t.minLength).max(500, t.maxLength),
    privacy: z.literal(true, { errorMap: () => ({ message: t.required }) }),
  });
}

type FormData = z.infer<ReturnType<typeof getSchema>>;

interface Props {
  locale: Locale;
}

export default function ContactForm({ locale }: Props) {
  const t = translations[locale] || translations.en;
  const schema = getSchema(t);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: 'contact', locale }),
      });
      if (!res.ok) throw new Error('Failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-lg border border-stone-300 bg-white text-stone-900 placeholder-stone-400 transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:border-navy-600 dark:bg-navy-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-teal-400';
  const labelClass = 'block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1';
  const errorClass = 'text-sm text-red-600 dark:text-red-400 mt-1';

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-8 text-center dark:border-teal-800 dark:bg-teal-900/20">
        <svg className="mx-auto h-12 w-12 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="mt-4 text-lg font-semibold text-teal-800 dark:text-teal-200">{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className={labelClass}>{t.name} *</label>
        <input id="contact-name" type="text" placeholder={t.namePlaceholder} className={inputClass} {...register('name')} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className={labelClass}>{t.email} *</label>
        <input id="contact-email" type="email" placeholder={t.emailPlaceholder} className={inputClass} {...register('email')} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className={labelClass}>{t.message} *</label>
        <textarea id="contact-message" rows={5} placeholder={t.messagePlaceholder} className={inputClass} {...register('message')} />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      {/* Privacy */}
      <div className="flex items-start gap-3">
        <input
          id="contact-privacy"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-navy-600 dark:bg-navy-800"
          {...register('privacy')}
        />
        <label htmlFor="contact-privacy" className="text-sm text-stone-600 dark:text-stone-400">{t.privacy}</label>
      </div>
      {errors.privacy && <p className={errorClass}>{errors.privacy.message}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? t.sending : t.submit}
      </button>

      {status === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">{t.error}</p>
      )}
    </form>
  );
}
