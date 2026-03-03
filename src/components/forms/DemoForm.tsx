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
    emailHelp: 'Useremo questo indirizzo solo per la comunicazione richiesta',
    phone: 'Telefono',
    phonePlaceholder: '+39 041 123 4567',
    property: 'Nome struttura',
    propertyPlaceholder: 'Hotel Splendido',
    rooms: 'Numero di camere',
    roomsHelp: 'Aiuta a personalizzare la demo sulla Sua realta',
    role: 'Ruolo',
    rolePlaceholder: 'Seleziona il Suo ruolo',
    roleDirector: 'Direttore / General Manager',
    roleOwner: 'Proprietario',
    roleRevenue: 'Revenue Manager',
    roleFrontOffice: 'Front Office Manager',
    roleIt: 'IT Manager',
    roleOther: 'Altro',
    message: 'Messaggio',
    messagePlaceholder: 'Come possiamo aiutarLa?',
    messageHelp: 'Opzionale. Domande specifiche o esigenze particolari',
    privacy: 'Acconsento al trattamento dei miei dati personali secondo l\'informativa privacy.',
    submit: 'Prenota la Demo Gratuita',
    required: 'Questo campo e obbligatorio',
    invalidEmail: 'Inserire un indirizzo email valido',
    minLength: 'Inserire almeno 2 caratteri',
    maxLength: 'Il campo non puo superare 500 caratteri',
    roomsRange: 'Inserire un numero tra 1 e 9999',
    success: 'Demo prenotata con successo. Le abbiamo inviato una conferma via email.',
    error: 'Si e verificato un errore. Riprovare o contattare supporto@sginformatica.com',
    sending: 'Invio in corso...',
  },
  en: {
    name: 'Full name',
    namePlaceholder: 'John Smith',
    email: 'Email',
    emailPlaceholder: 'name@hotel.com',
    emailHelp: 'We will only use this address for the requested communication',
    phone: 'Phone',
    phonePlaceholder: '+44 20 1234 5678',
    property: 'Property name',
    propertyPlaceholder: 'Grand Hotel',
    rooms: 'Number of rooms',
    roomsHelp: 'Helps us personalise the demo to your property',
    role: 'Role',
    rolePlaceholder: 'Select your role',
    roleDirector: 'Director / General Manager',
    roleOwner: 'Owner',
    roleRevenue: 'Revenue Manager',
    roleFrontOffice: 'Front Office Manager',
    roleIt: 'IT Manager',
    roleOther: 'Other',
    message: 'Message',
    messagePlaceholder: 'How can we help you?',
    messageHelp: 'Optional. Specific questions or particular needs',
    privacy: 'I consent to the processing of my personal data according to the privacy policy.',
    submit: 'Book Your Free Demo',
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    minLength: 'Please enter at least 2 characters',
    maxLength: 'This field cannot exceed 500 characters',
    roomsRange: 'Please enter a number between 1 and 9999',
    success: 'Demo successfully booked. We have sent you a confirmation email.',
    error: 'An error occurred. Please try again or contact supporto@sginformatica.com',
    sending: 'Sending...',
  },
  de: {
    name: 'Vor- und Nachname',
    namePlaceholder: 'Max Mustermann',
    email: 'E-Mail',
    emailPlaceholder: 'name@hotel.de',
    emailHelp: 'Wir verwenden diese Adresse nur fuer die angeforderte Kommunikation',
    phone: 'Telefon',
    phonePlaceholder: '+49 30 1234 5678',
    property: 'Name des Hauses',
    propertyPlaceholder: 'Hotel Prachtblick',
    rooms: 'Anzahl der Zimmer',
    roomsHelp: 'Hilft uns, die Demo auf Ihr Haus zuzuschneiden',
    role: 'Position',
    rolePlaceholder: 'Waehlen Sie Ihre Position',
    roleDirector: 'Direktor / General Manager',
    roleOwner: 'Eigentuemer',
    roleRevenue: 'Revenue Manager',
    roleFrontOffice: 'Front Office Manager',
    roleIt: 'IT-Manager',
    roleOther: 'Sonstige',
    message: 'Nachricht',
    messagePlaceholder: 'Wie koennen wir Ihnen helfen?',
    messageHelp: 'Optional. Spezifische Fragen oder besondere Beduerfnisse',
    privacy: 'Ich stimme der Verarbeitung meiner personenbezogenen Daten gemaess der Datenschutzerklaerung zu.',
    submit: 'Kostenlose Demo buchen',
    required: 'Dieses Feld ist erforderlich',
    invalidEmail: 'Bitte geben Sie eine gueltige E-Mail-Adresse ein',
    minLength: 'Bitte geben Sie mindestens 2 Zeichen ein',
    maxLength: 'Dieses Feld darf 500 Zeichen nicht ueberschreiten',
    roomsRange: 'Bitte geben Sie eine Zahl zwischen 1 und 9999 ein',
    success: 'Demo erfolgreich gebucht. Wir haben Ihnen eine Bestaetigungs-E-Mail gesendet.',
    error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie supporto@sginformatica.com',
    sending: 'Wird gesendet...',
  },
  fr: {
    name: 'Nom complet',
    namePlaceholder: 'Jean Dupont',
    email: 'E-mail',
    emailPlaceholder: 'nom@hotel.fr',
    emailHelp: 'Nous utiliserons cette adresse uniquement pour la communication demandee',
    phone: 'Telephone',
    phonePlaceholder: '+33 1 23 45 67 89',
    property: 'Nom de l\'etablissement',
    propertyPlaceholder: 'Grand Hotel',
    rooms: 'Nombre de chambres',
    roomsHelp: 'Nous aide a personnaliser la demo pour votre etablissement',
    role: 'Fonction',
    rolePlaceholder: 'Selectionnez votre fonction',
    roleDirector: 'Directeur / General Manager',
    roleOwner: 'Proprietaire',
    roleRevenue: 'Revenue Manager',
    roleFrontOffice: 'Responsable reception',
    roleIt: 'Responsable IT',
    roleOther: 'Autre',
    message: 'Message',
    messagePlaceholder: 'Comment pouvons-nous vous aider ?',
    messageHelp: 'Facultatif. Questions specifiques ou besoins particuliers',
    privacy: 'J\'accepte le traitement de mes donnees personnelles conformement a la politique de confidentialite.',
    submit: 'Reservez votre demo gratuite',
    required: 'Ce champ est obligatoire',
    invalidEmail: 'Veuillez saisir une adresse e-mail valide',
    minLength: 'Veuillez saisir au moins 2 caracteres',
    maxLength: 'Ce champ ne peut pas depasser 500 caracteres',
    roomsRange: 'Veuillez saisir un nombre entre 1 et 9999',
    success: 'Demo reservee avec succes. Nous vous avons envoye un e-mail de confirmation.',
    error: 'Une erreur est survenue. Veuillez reessayer ou contacter supporto@sginformatica.com',
    sending: 'Envoi en cours...',
  },
  es: {
    name: 'Nombre completo',
    namePlaceholder: 'Juan Garcia',
    email: 'E-mail',
    emailPlaceholder: 'nombre@hotel.es',
    emailHelp: 'Solo utilizaremos esta direccion para la comunicacion solicitada',
    phone: 'Telefono',
    phonePlaceholder: '+34 91 123 45 67',
    property: 'Nombre del establecimiento',
    propertyPlaceholder: 'Gran Hotel',
    rooms: 'Numero de habitaciones',
    roomsHelp: 'Nos ayuda a personalizar la demo para su establecimiento',
    role: 'Cargo',
    rolePlaceholder: 'Seleccione su cargo',
    roleDirector: 'Director / General Manager',
    roleOwner: 'Propietario',
    roleRevenue: 'Revenue Manager',
    roleFrontOffice: 'Jefe de recepcion',
    roleIt: 'Responsable IT',
    roleOther: 'Otro',
    message: 'Mensaje',
    messagePlaceholder: 'Como podemos ayudarle?',
    messageHelp: 'Opcional. Preguntas especificas o necesidades particulares',
    privacy: 'Consiento el tratamiento de mis datos personales de acuerdo con la politica de privacidad.',
    submit: 'Reserve su demo gratuita',
    required: 'Este campo es obligatorio',
    invalidEmail: 'Introduzca una direccion de e-mail valida',
    minLength: 'Introduzca al menos 2 caracteres',
    maxLength: 'Este campo no puede superar 500 caracteres',
    roomsRange: 'Introduzca un numero entre 1 y 9999',
    success: 'Demo reservada con exito. Le hemos enviado un e-mail de confirmacion.',
    error: 'Se ha producido un error. Intentelo de nuevo o contacte con supporto@sginformatica.com',
    sending: 'Enviando...',
  },
};

function getSchema(t: Record<string, string>) {
  return z.object({
    name: z.string().min(2, t.minLength),
    email: z.string().email(t.invalidEmail),
    phone: z.string().optional().or(z.literal('')),
    property: z.string().min(2, t.minLength),
    rooms: z.coerce.number().min(1, t.roomsRange).max(9999, t.roomsRange),
    role: z.string().min(1, t.required),
    message: z.string().max(500, t.maxLength).optional().or(z.literal('')),
    privacy: z.literal(true, { errorMap: () => ({ message: t.required }) }),
  });
}

type FormData = z.infer<ReturnType<typeof getSchema>>;

interface Props {
  locale: Locale;
}

export default function DemoForm({ locale }: Props) {
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
        body: JSON.stringify({ ...data, type: 'demo', locale }),
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
  const helpClass = 'text-xs text-stone-500 dark:text-stone-400 mt-1';

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
        <label htmlFor="name" className={labelClass}>{t.name} *</label>
        <input id="name" type="text" placeholder={t.namePlaceholder} className={inputClass} {...register('name')} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>{t.email} *</label>
        <input id="email" type="email" placeholder={t.emailPlaceholder} className={inputClass} {...register('email')} />
        <p className={helpClass}>{t.emailHelp}</p>
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClass}>{t.phone}</label>
        <input id="phone" type="tel" placeholder={t.phonePlaceholder} className={inputClass} {...register('phone')} />
      </div>

      {/* Property name */}
      <div>
        <label htmlFor="property" className={labelClass}>{t.property} *</label>
        <input id="property" type="text" placeholder={t.propertyPlaceholder} className={inputClass} {...register('property')} />
        {errors.property && <p className={errorClass}>{errors.property.message}</p>}
      </div>

      {/* Rooms + Role row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="rooms" className={labelClass}>{t.rooms} *</label>
          <input id="rooms" type="number" min={1} max={9999} className={inputClass} {...register('rooms')} />
          <p className={helpClass}>{t.roomsHelp}</p>
          {errors.rooms && <p className={errorClass}>{errors.rooms.message}</p>}
        </div>
        <div>
          <label htmlFor="role" className={labelClass}>{t.role} *</label>
          <select id="role" className={inputClass} {...register('role')} defaultValue="">
            <option value="" disabled>{t.rolePlaceholder}</option>
            <option value="director">{t.roleDirector}</option>
            <option value="owner">{t.roleOwner}</option>
            <option value="revenue">{t.roleRevenue}</option>
            <option value="front_office">{t.roleFrontOffice}</option>
            <option value="it">{t.roleIt}</option>
            <option value="other">{t.roleOther}</option>
          </select>
          {errors.role && <p className={errorClass}>{errors.role.message}</p>}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelClass}>{t.message}</label>
        <textarea id="message" rows={4} placeholder={t.messagePlaceholder} className={inputClass} {...register('message')} />
        <p className={helpClass}>{t.messageHelp}</p>
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      {/* Privacy */}
      <div className="flex items-start gap-3">
        <input
          id="privacy"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-stone-300 text-teal-600 focus:ring-teal-500 dark:border-navy-600 dark:bg-navy-800"
          {...register('privacy')}
        />
        <label htmlFor="privacy" className="text-sm text-stone-600 dark:text-stone-400">{t.privacy}</label>
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
