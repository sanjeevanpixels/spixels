import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { CFG } from '../../data/config';
import { SERVICES } from '../../data/content';

const EMPTY = { name: '', email: '', message: '', company: '' };
const IDS = { name: 'contact-name', email: 'contact-email', message: 'contact-message' };

const validateField = (values, key) => {
  if (key === 'name' && !values.name.trim()) return 'Add your name so I know who to reply to.';
  if (key === 'email' && !/^\S+@\S+\.\S+$/.test(values.email.trim())) return 'Enter a valid email, like name@example.com.';
  if (key === 'message' && values.message.trim().length < 10) return 'Add a sentence or two about your project.';
  return '';
};

const validate = (values) =>
  Object.fromEntries(
    ['name', 'email', 'message'].flatMap((key) => {
      const error = validateField(values, key);
      return error ? [[key, error]] : [];
    }),
  );

function Field({ id, label, error, reserve = true, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-neutral-200">
        {label}
      </label>
      {children}
      {reserve && (
        <p
          id={`${id}-err`}
          role={error ? 'alert' : undefined}
          className="mt-1 min-h-[18px] text-[13px] leading-[18px] text-red-600 dark:text-red-300"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ service, onServiceChange }) {
  const formRef = useRef(null);
  const sentRef = useRef(null);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (status === 'sent') sentRef.current?.focus();
  }, [status]);

  const setFieldError = (nextValues, key) =>
    setErrors((current) => ({ ...current, [key]: validateField(nextValues, key) }));

  const change = (key) => (event) => {
    const next = { ...values, [key]: event.target.value };
    setValues(next);
    if (touched[key]) setFieldError(next, key);
  };

  const fieldProps = (key, maxLength) => {
    const showError = Boolean(touched[key] && errors[key]);
    return {
      id: IDS[key],
      value: values[key],
      onChange: change(key),
      onBlur: () => {
        setTouched((old) => ({ ...old, [key]: true }));
        setFieldError(values, key);
      },
      'aria-invalid': showError,
      'aria-describedby': showError ? `${IDS[key]}-err` : undefined,
      maxLength,
      className: 'contact-field',
    };
  };

  const submit = async (event) => {
    event.preventDefault();
    if (values.company || status === 'sending') return; // honeypot + double-submit guard

    const found = validate(values);
    setErrors(found);
    setTouched({ name: true, email: true, message: true });

    const first = Object.keys(found)[0];
    if (first) return formRef.current?.querySelector(`#${IDS[first]}`)?.focus();

    const payload = {
      service,
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };

    if (CFG.formEndpoint) {
      setStatus('sending');
      try {
        const response = await fetch(CFG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error('Message could not be sent');
        setStatus('sent');
      } catch {
        setStatus('error');
      }
    } else {
      const subject = encodeURIComponent(`${service} — ${payload.name}`);
      const body = encodeURIComponent(`${payload.message}\n\nFrom: ${payload.name} (${payload.email})`);
      window.location.href = `mailto:${CFG.email}?subject=${subject}&body=${body}`;
      setStatus('sent');
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  if (status === 'sent') {
    return (
      <div role="status" className="py-6 text-center">
        <span className="flex items-center justify-center mx-auto rounded-full h-14 w-14 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h2 ref={sentRef} tabIndex={-1} className="mt-4 text-2xl font-bold outline-none font-bricolage">
          {CFG.formEndpoint ? 'Message sent' : 'Your email app should be opening'}
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-neutral-300">
          {CFG.formEndpoint
            ? `Thanks, ${values.name.split(' ')[0]}. I’ll reply to ${values.email} soon.`
            : 'Press send in your email app to finish.'}
        </p>
        <Button onClick={reset} className="mt-5 border btn-soft min-h-12 border-slate-200 dark:border-neutral-700">
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} className="grid gap-2 contact-form" noValidate>
      <Field id="contact-service" label="What do you need help with?" reserve={false} className="mb-2">
        <div className="relative">
          <select
            id="contact-service"
            value={service}
            onChange={(event) => onServiceChange(event.target.value)}
            className="contact-field"
          >
            <option value="General enquiry">General enquiry</option>
            {SERVICES.map(([title]) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="absolute w-4 h-4 -translate-y-1/2 pointer-events-none right-4 top-1/2 text-slate-500 dark:text-neutral-400"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="m5 8 5 5 5-5" />
          </svg>
        </div>
      </Field>

      <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
        <Field id={IDS.name} label="Your name" error={touched.name && errors.name}>
          <input {...fieldProps('name', 100)} autoComplete="name" placeholder="Jane Doe" required />
        </Field>
        <Field id={IDS.email} label="Your email" error={touched.email && errors.email}>
          <input {...fieldProps('email', 254)} type="email" inputMode="email" autoComplete="email" placeholder="name@example.com" required />
        </Field>
      </div>

      <Field id={IDS.message} label="Tell me about your project" error={touched.message && errors.message}>
        <textarea {...fieldProps('message', 2000)} rows={4} placeholder="What are you building, and when do you need it?" required />
      </Field>

      <div className="hidden" aria-hidden="true">
        <input tabIndex={-1} autoComplete="off" name="company" value={values.company} onChange={change('company')} />
      </div>

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-300">
          That didn’t send. Check your connection and try again, or email {CFG.email}.
        </p>
      )}

      <Button
        type="submit"
        disabled={status === 'sending'}
        className="min-h-12 w-full bg-[#0D0F17] text-white hover:bg-black disabled:opacity-60 sm:w-auto sm:justify-self-start dark:bg-white dark:text-[#0D0F17] dark:hover:bg-neutral-200"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'} <Icon name="send" />
      </Button>
    </form>
  );
}