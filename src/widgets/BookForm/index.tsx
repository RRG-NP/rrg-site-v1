'use client';
import { useRouter } from 'next/navigation';
import { FC, FormEvent, useState } from 'react';

import { BOOK_FORM_DEFAULT_STATE, INPUT_FIELDS, RADIO_FIELDS } from '@/data';

import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';

const INPUT_CLASSES =
  'w-full appearance-none rounded-[0.35vw] border border-stroke/60 bg-white/[0.03] px-[1vw] text-text-1 transition-colors duration-200 placeholder:text-text-1/30 hover:border-stroke focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:rounded-md md:px-3.5 md:text-sm tab:text-sm';

const CHIP_CLASSES =
  'inline-block cursor-pointer select-none rounded-full border border-stroke/60 bg-white/[0.03] px-[1.2vw] py-[0.45vw] text-[1vw] font-medium text-text-1/60 transition-colors duration-200 hover:border-stroke hover:text-text-1/85 peer-focus-visible:ring-2 peer-focus-visible:ring-primary/60 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-1 peer-data-[state=checked]:border-primary/80 peer-data-[state=checked]:bg-primary/15 peer-data-[state=checked]:text-primary md:px-4 md:py-1.5 md:text-sm tab:px-3.5 tab:py-1.5 tab:text-sm';

interface Props {}

const Index: FC<Props> = () => {
  const [form, setForm] = useState(BOOK_FORM_DEFAULT_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const { push } = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reset form after successful submission
        setForm(BOOK_FORM_DEFAULT_STATE);
        // Redirect to success page
        push('/book/success');
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit the form. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-x-[3vw] gap-y-[2.4vw] tab:grid-cols-1 tab:gap-y-8 md:gap-y-7">
        {RADIO_FIELDS.map((item) => (
          <RadioGroup
            onValueChange={(value) => setForm((prev) => ({ ...prev, [item.formKey]: value }))}
            key={item.title}
            className="block w-full"
            required={true}
          >
            <h4 className="mb-[0.8vw] text-[1.15vw] font-medium text-text-1/85 md:mb-3 md:text-base tab:text-[0.95rem]">
              {item.title}
            </h4>
            <div className="flex flex-wrap gap-[0.6vw] md:gap-2 tab:gap-2">
              {item.radioArray.map((radio) => (
                <div key={radio.value} className="relative">
                  <RadioGroupItem
                    value={radio.value}
                    id={radio.name}
                    required={true}
                    className="peer pointer-events-none absolute h-px w-px opacity-0"
                  />
                  <label htmlFor={radio.name} className={CHIP_CLASSES}>
                    {radio.name}
                  </label>
                </div>
              ))}
            </div>
          </RadioGroup>
        ))}
      </div>

      <div className="mt-[2.8vw] w-full space-y-[1.8vw] md:mt-8 md:space-y-4 tab:mt-9 tab:space-y-5">
        {INPUT_FIELDS.map((item) => (
          <div key={item.label} className={`w-full ${item.classes} md:!mr-0 md:!w-full`}>
            <label
              htmlFor={item.label}
              className="mb-[0.4vw] inline-block text-[1vw] font-medium leading-[1.5] text-text-1/70 md:mb-1.5 md:text-sm tab:text-[0.85rem]"
            >
              {item.label}
            </label>
            <input
              onChange={({ target: { name, value } }) => setForm((prev) => ({ ...prev, [name]: value }))}
              type={item.type || 'text'}
              name={item.name}
              id={item.label}
              autoComplete={item.autoComplete}
              inputMode={item.inputMode}
              spellCheck={item.spellCheck}
              className={`h-[3.2vw] md:h-12 tab:h-11 ${INPUT_CLASSES}`}
              required={item.required}
            />
          </div>
        ))}
        <div className="w-full">
          <label
            className="mb-[0.4vw] inline-block text-[1vw] font-medium leading-[1.5] text-text-1/70 md:mb-1.5 md:text-sm tab:text-[0.85rem]"
            htmlFor="message"
          >
            Tell us about your project
          </label>
          <textarea
            minLength={20}
            maxLength={500}
            onChange={({ target: { name, value } }) => setForm((prev) => ({ ...prev, [name]: value }))}
            id="message"
            name="message"
            placeholder="Goals, timeline, links — anything that helps us understand."
            className={`min-h-[10vw] resize-none py-[0.6vw] text-[1.1vw] md:min-h-[40vw] md:py-2.5 tab:min-h-[160px] tab:py-2.5 ${INPUT_CLASSES}`}
          />
        </div>
      </div>

      {/* Error Message */}
      <div aria-live="polite" className="w-full">
        {submitStatus && submitStatus.type === 'error' && (
          <div
            role="alert"
            className="mt-[2vw] w-full rounded-[0.5vw] border border-red-500/50 bg-red-500/20 p-[1.5vw] text-center text-[1.2vw] text-red-300 md:mt-4 md:rounded-lg md:p-3 md:text-sm tab:text-sm"
          >
            {submitStatus.message}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-[2.5vw] inline-flex items-center justify-center rounded-full bg-primary px-[3em] py-[1em] text-[clamp(0.8rem,1vw,1rem)] font-semibold uppercase tracking-[0.12em] text-bg-1 transition duration-300 hover:-translate-y-[2px] hover:bg-text-1 hover:shadow-[0_0_50px_rgba(204,194,220,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-primary disabled:hover:shadow-none md:mt-7 md:w-full"
      >
        {isSubmitting ? 'Submitting…' : 'Send request'}
      </button>
    </form>
  );
};
export default Index;
