import { useEffect, useRef, useState } from 'react';
import Button from '../ui/Button';
import Icon from '../ui/Icon';
import { CFG } from '../../data/config';
import { SERVICES } from '../../data/content';

const EMPTY = {
  name: '',
  email: '',
  message: '',
  company: '',
};

const IDS = {
  name: 'contact-name',
  email: 'contact-email',
  message: 'contact-message',
};

const validateField = (values, key) => {
  if (key === 'name' && !values.name.trim()) {
    return 'Please enter your name.';
  }

  if (
    key === 'email' &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  ) {
    return 'Please enter a valid email address.';
  }

  if (key === 'message' && values.message.trim().length < 10) {
    return 'Please provide at least 10 characters.';
  }

  return '';
};

const validate = (values) =>
  Object.fromEntries(
    ['name', 'email', 'message'].flatMap((key) => {
      const error = validateField(values, key);
      return error ? [[key, error]] : [];
    }),
  );

function Field({ id, label, error, children, className = '' }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-slate-700 dark:text-neutral-200"
      >
        {label}
      </label>

      {children}

      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          className="mt-1.5 text-xs leading-5 text-red-600 dark:text-red-400"
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
    if (status === 'sent') {
      sentRef.current?.focus();
    }
  }, [status]);

  const change = (key) => (event) => {
    const next = {
      ...values,
      [key]: event.target.value,
    };

    setValues(next);

    if (touched[key]) {
      setErrors((current) => ({
        ...current,
        [key]: validateField(next, key),
      }));
    }

    if (status === 'error') {
      setStatus('idle');
    }
  };

  const fieldProps = (key, maxLength) => {
    const showError = Boolean(touched[key] && errors[key]);

    return {
      id: IDS[key],
      name: key,
      value: values[key],
      onChange: change(key),
      onBlur: () => {
        setTouched((current) => ({
          ...current,
          [key]: true,
        }));

        setErrors((current) => ({
          ...current,
          [key]: validateField(values, key),
        }));
      },
      'aria-invalid': showError,
      'aria-describedby': showError ? `${IDS[key]}-err` : undefined,
      maxLength,
      className: 'contact-field w-full min-w-0',
    };
  };

  const submit = async (event) => {
    event.preventDefault();

    // Honeypot and double-submit protection.
    if (values.company || status === 'sending') return;

    setStatus('idle');

    const found = validate(values);

    setErrors(found);
    setTouched({
      name: true,
      email: true,
      message: true,
    });

    const first = Object.keys(found)[0];

    if (first) {
      formRef.current
        ?.querySelector(`#${IDS[first]}`)
        ?.focus();

      return;
    }

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
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Message could not be sent.');
        }

        setStatus('sent');
      } catch {
        setStatus('error');
      }
    } else {
      const subject = encodeURIComponent(
        `${service} — ${payload.name}`,
      );

      const body = encodeURIComponent(
        `${payload.message}\n\nFrom: ${payload.name} (${payload.email})`,
      );

      window.location.href =
        `mailto:${CFG.email}?subject=${subject}&body=${body}`;

      setStatus('sent');
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  // Success state.
  if (status === 'sent') {
    return (
      <div role="status" className="py-8 text-center">
        <span className="flex items-center justify-center mx-auto rounded-full h-14 w-14 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <Icon name="check" className="h-7 w-7" />
        </span>

        <h2
          ref={sentRef}
          tabIndex={-1}
          className="mt-5 text-2xl font-bold outline-none font-bricolage text-slate-900 dark:text-white"
        >
          {CFG.formEndpoint
            ? 'Message sent successfully!'
            : 'Your email app should be opening'}
        </h2>

        <p className="max-w-sm mx-auto mt-2 text-sm leading-6 text-slate-600 dark:text-neutral-400">
          {CFG.formEndpoint
            ? `Thank you, ${values.name.split(' ')[0]}. I'll get back to you at ${values.email} soon.`
            : 'Please press send in your email application to complete your message.'}
        </p>

        <Button
          onClick={reset}
          className="mt-6 border btn-soft min-h-11 border-slate-200 dark:border-neutral-700"
        >
          Write another message
        </Button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="grid w-full gap-5 contact-form"
      noValidate
    >
      {/* Service selection */}
      <Field
        id="contact-service"
        label="What do you need help with?"
      >
        <select
          id="contact-service"
          name="service"
          value={service}
          onChange={(event) => onServiceChange(event.target.value)}
          className="w-full min-w-0 contact-field"
        >
          <option value="General enquiry">
            General enquiry
          </option>

          {SERVICES.map(([title]) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      </Field>

      {/* Name and email */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          id={IDS.name}
          label="Your name"
          error={touched.name && errors.name}
        >
          <input
            {...fieldProps('name', 100)}
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            required
          />
        </Field>

        <Field
          id={IDS.email}
          label="Your email"
          error={touched.email && errors.email}
        >
          <input
            {...fieldProps('email', 254)}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            required
          />
        </Field>
      </div>

      {/* Project message */}
      <Field
        id={IDS.message}
        label="Tell me about your project"
        error={touched.message && errors.message}
      >
        <textarea
          {...fieldProps('message', 2000)}
          rows={5}
          placeholder="Tell me about your project, goals, and timeline..."
          required
          className="contact-field min-h-[140px] w-full resize-y"
        />
      </Field>

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input
          tabIndex={-1}
          autoComplete="off"
          name="company"
          value={values.company}
          onChange={change('company')}
        />
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p
          role="alert"
          className="px-4 py-3 text-sm leading-5 text-red-700 rounded-lg bg-red-50 dark:bg-red-950/30 dark:text-red-300"
        >
          Unable to send your message. Please check your connection
          and try again, or email {CFG.email}.
        </p>
      )}

      {/* Submit button */}
      <div>
        <Button
          type="submit"
          disabled={status === 'sending'}
          className="min-h-12 w-full bg-[#0D0F17] px-7 text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:bg-white dark:text-[#0D0F17] dark:hover:bg-neutral-200"
        >
          {status === 'sending'
            ? 'Sending...'
            : 'Send message'}
        </Button>
      </div>
    </form>
  );
}