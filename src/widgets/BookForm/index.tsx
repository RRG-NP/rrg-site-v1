'use client';
import { useRouter } from 'next/navigation';
import { FC, FormEvent, useState } from 'react';

import { BOOK_FORM_DEFAULT_STATE, INPUT_FIELDS, RADIO_FIELDS } from '@/data';

import Button from '@/components/ui/Button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/RadioGroup';

interface Props { }

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
    <div className="mx-auto max-w-[70vw] md:max-w-[85vw] px-[4vw] ">
      <div className="relative">
        <button
          className=" group absolute left-0 top-[25%] z-10 box-content rounded-full bg-stone-800 p-[0.5vw] hover:bg-stone-800"
          onClick={() => push('/')}
          aria-label="Go back to homepage"
          type="button"
        >
          <svg
            focusable="false"
            className="h-[1.5vw] w-[1.5vw] md:h-[2.25vw] md:w-[2.25vw] fill-stone-400 transition group-hover:fill-stone-300"
            viewBox="0 0 24 24"
          >
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z"></path>
          </svg>
        </button>
        <h1 className="mb-[1.75vw] md:text-[4.6vw] md:mb-[2.25vw] text-center text-[3.5vw] font-bold leading-[100%]">Request form</h1>
      </div>
      <form className="flex h-full flex-col items-center" onSubmit={handleSubmit}>
        <div className="flex flex-wrap">
          {RADIO_FIELDS.map((item) => (
            <RadioGroup
              onValueChange={(value) => setForm((prev) => ({ ...prev, [item.formKey]: value }))}
              key={item.title}
              className={`mb-[1.75vw] inline-block w-[calc(50%-1.75vw)] ${item.classes}`}
              required={true}
            >
              <h4 className="mb-[0.2vw] md:mb-[0.5vw] text-[1.3vw] md:text-[1.6vw] font-medium">{item.title}</h4>
              {item.radioArray.map((radio) => (
                <div key={radio.value} className="flex items-center space-x-[0.65vw] md:space-x-[1vw] md:space-y-[0.3vw] font-[400]">
                  <RadioGroupItem value={radio.value} id={radio.name} required={true} />
                  <label htmlFor={radio.name} className="text-[1vw] md:text-[1.25vw] leading-[1.75vw]">
                    {radio.name}
                  </label>
                </div>
              ))}
            </RadioGroup>
          ))}

          <div className="w-full space-y-[2vw] text-[1.1vw]">
            {INPUT_FIELDS.map((item) => (
              <div key={item.label} className={`w-full ${item.classes}`}>
                <label htmlFor={item.label} className="leading-[1.5] mb-[0.4vw] text-[1.2vw] md:text-[1.5vw] inline-block">
                  {item.label}
                </label>
                <input
                  onChange={({ target: { name, value } }) => setForm((prev) => ({ ...prev, [name]: value }))}
                  type={item.type || 'text'}
                  name={item.name}
                  id={item.label}
                  className="h-[3vw] md:h-[4vw] w-full appearance-none rounded-[0.25vw] border-[0.125vw] border-primary/80 bg-transparent px-[1vw] py-[0.8vw]"
                  required={item.required}
                />
              </div>
            ))}
            <div className="w-full">
              <label className="leading-[1.5] mb-[0.4vw] text-[1.2vw] md:text-[1.5vw] inline-block" htmlFor="message">
                Tell us about your project
              </label>
              <textarea
                minLength={20}
                maxLength={500}
                onChange={({ target: { name, value } }) => setForm((prev) => ({ ...prev, [name]: value }))}
                id="message"
                name="message"
                className="min-h-[10vw] w-full resize-none border-[0.125vw] rounded-[0.125vw] text-[1.2vw] md:text-[1.5vw] border-primary/80 bg-transparent px-[0.8vw] py-[0.6vw]"
              />
            </div>
          </div>

          {/* Error Message */}
          {submitStatus && submitStatus.type === 'error' && (
            <div className="mb-[2vw] w-full rounded-[0.5vw] p-[1.5vw] text-center text-[1.2vw] md:text-[1.5vw] bg-red-500/20 text-red-300 border border-red-500/50">
              {submitStatus.message}
            </div>
          )}

          <Button
            title={isSubmitting ? 'Submitting...' : 'Submit'}
            type="submit"
            classes={`py-[1.2vw] px-[5vw] md:py-[1.6vw] md:px-[8vw] text-[1.1vw] md:text-[1.5vw] ${isSubmitting ? 'bg-bg-1/50 cursor-not-allowed' : 'bg-bg-1/90 hover:bg-bg-1/80'
              }`}
            btnClasses="p-[0.2vw] md:p-[0.25vw] capitalize self-start mt-[2.5vw]"
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
export default Index;
