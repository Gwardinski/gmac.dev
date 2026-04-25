import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import z from 'zod';
import { Alert, AlertDescription, AlertHeader, AlertTitle } from '../alert';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, Form } from '../field';
import { Input, InputAddon, InputGroup, InputGroupButton, InputGroupIconButton, InputGroupText, Textarea, TextareaBottom } from '../input-group';
import { RadioGroup, RadioGroupItem } from '../radio-group';
import { TextAnchor } from '../text-button';

const FORM_ID = 'form-example-demo';

type SubscriptionOption = {
  optionId: string;
  label: string;
  disabled?: boolean;
  description?: string;
};

const planOptions: SubscriptionOption[] = [
  { optionId: '0', label: 'Label Option 1 (disabled)', disabled: true },
  { optionId: '1', label: 'Label Option 2' },
  { optionId: '2', label: 'Label Option 3 (disabled)', description: 'Description (disabled)', disabled: true },
  { optionId: '3', label: 'Label Option 4', description: 'Description' }
];

const formExampleSchema = z.object({
  username: z.string().min(6, 'Username must be at least 6 characters.').max(24, 'Username must be at most 24 characters.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(24, 'Password must be at most 24 characters.'),
  websitePath: z.string().max(128),
  lookupQuery: z.string().max(200),
  notes: z.string().max(2000),
  reply: z.string().max(2000),
  attachmentNote: z.string().max(2000),
  terms: z.literal(true, { message: 'You must agree to the terms of service.' }),
  checkbox1: z.boolean(),
  disabledFalse: z.boolean(),
  disabledTrue: z.boolean(),
  option: z.string().min(1, 'You must select an option to continue.')
});

export const FormExample = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      websitePath: '',
      lookupQuery: '',
      notes: '',
      reply: '',
      attachmentNote: '',
      terms: false,
      checkbox1: false,
      disabledFalse: false,
      disabledTrue: true,
      option: '1'
    },
    validators: {
      onSubmit: formExampleSchema
    },
    onSubmit: async () => {
      setIsSubmitted(true);
    }
  });

  if (isSubmitted) {
    const v = form.state.values;
    const planLabel = planOptions.find((o) => o.optionId === v.option)?.label ?? v.option;
    return (
      <Alert theme="green">
        <AlertHeader>
          <AlertTitle>Form submitted successfully</AlertTitle>
        </AlertHeader>
        <AlertDescription>Account: {v.username} · password (hidden)</AlertDescription>
        <AlertDescription>Website path: {v.websitePath || '—'}</AlertDescription>
        <AlertDescription>Lookup: {v.lookupQuery || '—'}</AlertDescription>
        {v.notes ? <AlertDescription>Notes: {v.notes}</AlertDescription> : null}
        {v.reply ? <AlertDescription>Reply: {v.reply}</AlertDescription> : null}
        {v.attachmentNote ? <AlertDescription>Attachment hint: {v.attachmentNote}</AlertDescription> : null}
        <AlertDescription>
          ToS / checkbox1 / disabled demos: {v.terms ? 'Y' : 'n'} / {v.checkbox1 ? 'Y' : 'n'} / {v.disabledFalse ? 'Y' : 'n'} / {v.disabledTrue ? 'Y' : 'n'}
        </AlertDescription>
        <AlertDescription>Plan: {planLabel}</AlertDescription>
        <Button
          type="button"
          onClick={() => {
            form.reset();
            setIsSubmitted(false);
          }}>
          Reset
        </Button>
      </Alert>
    );
  }

  return (
    <Form
      id={FORM_ID}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <FieldSet>
        <FieldLegend>FieldLegend</FieldLegend>
        <FieldGroup>
          <form.Field name="username">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={`${FORM_ID}-username`}>FieldLabel</FieldLabel>
                  <Input
                    id={`${FORM_ID}-username`}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Placeholder"
                    autoComplete="off"
                  />
                  <FieldError errors={field.state.meta.errors} />
                  <FieldDescription>FieldDescription</FieldDescription>
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={`${FORM_ID}-password`}>FieldLabel</FieldLabel>
                  <Input
                    id={`${FORM_ID}-password`}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="password"
                    placeholder="••••••••"
                    autoComplete="off"
                  />
                  <FieldError errors={field.state.meta.errors} />
                  <FieldDescription>FieldDescription</FieldDescription>
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>FieldLegend</FieldLegend>
        <FieldDescription>FieldDescription</FieldDescription>
        <FieldGroup>
          <form.Field name="websitePath">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={`${FORM_ID}-website`}>FieldLabel</FieldLabel>
                  <InputGroup>
                    <InputAddon>
                      <InputGroupText>InputGroupText</InputGroupText>
                    </InputAddon>
                    <Input
                      id={`${FORM_ID}-website`}
                      variant="group"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Placeholder"
                      autoComplete="off"
                    />
                  </InputGroup>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="lookupQuery">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={`${FORM_ID}-lookup`}>FieldLabel</FieldLabel>
                  <InputGroup>
                    <InputAddon align="left">
                      <InputGroupText>
                        <IconSearch />
                      </InputGroupText>
                    </InputAddon>
                    <Input
                      id={`${FORM_ID}-lookup`}
                      variant="group"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Placeholder"
                    />
                    <InputAddon align="right">
                      <InputGroupButton type="button">InputGroupButton</InputGroupButton>
                    </InputAddon>
                  </InputGroup>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>FieldLegend</FieldLegend>
        <FieldDescription>FieldDescription</FieldDescription>
        <FieldGroup>
          <form.Field name="reply">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`${FORM_ID}-reply`}>FieldLabel</FieldLabel>
                <Textarea
                  id={`${FORM_ID}-reply`}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Placeholder"
                  rows={2}
                />
              </Field>
            )}
          </form.Field>
          <form.Field name="attachmentNote">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`${FORM_ID}-attach`}>FieldLabel</FieldLabel>
                <InputGroup>
                  <Textarea
                    id={`${FORM_ID}-attach`}
                    variant="group"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Placeholder"
                    rows={2}
                  />
                  <TextareaBottom>
                    <InputGroupIconButton type="button" theme="gray" variant="ghost" aria-label="Attach">
                      <IconPlus />
                    </InputGroupIconButton>
                  </TextareaBottom>
                </InputGroup>
              </Field>
            )}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>FieldLegend</FieldLegend>
          <FieldDescription>FieldDescription</FieldDescription>
          <FieldGroup checkbox>
            <form.Field name="terms">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid} data-checked={field.state.value}>
                    <Checkbox id={`${FORM_ID}-tos`} checked={field.state.value} onCheckedChange={(checked) => field.handleChange(checked === true)} aria-invalid={isInvalid} />
                    <FieldContent>
                      <FieldLabel htmlFor={`${FORM_ID}-tos`}>
                        FieldLabel I agree to the{' '}
                        <TextAnchor href="/" target="_blank">
                          TextAnchor
                        </TextAnchor>
                      </FieldLabel>
                      <FieldError errors={field.state.meta.errors} />
                    </FieldContent>
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="checkbox1">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid} data-checked={field.state.value}>
                    <Checkbox
                      id={`${FORM_ID}-checkbox1`}
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked === true)}
                      aria-invalid={isInvalid}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={`${FORM_ID}-checkbox1`}>FieldLabel</FieldLabel>
                      <FieldError errors={field.state.meta.errors} />
                      <FieldDescription>FieldDescription</FieldDescription>
                    </FieldContent>
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="disabledFalse">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid} data-checked={field.state.value} data-disabled={true}>
                    <Checkbox
                      id={`${FORM_ID}-dis-false`}
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked === true)}
                      aria-invalid={isInvalid}
                      disabled={true}
                      aria-disabled={true}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={`${FORM_ID}-dis-false`}>FieldLabel Disabled unchecked</FieldLabel>
                      <FieldDescription>FieldDescription: When disabled.</FieldDescription>
                    </FieldContent>
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="disabledTrue">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid} data-checked={field.state.value} data-disabled={true}>
                    <Checkbox
                      id={`${FORM_ID}-dis-true`}
                      checked={field.state.value}
                      onCheckedChange={(checked) => field.handleChange(checked === true)}
                      aria-invalid={isInvalid}
                      disabled={true}
                      aria-disabled={true}
                    />
                    <FieldContent>
                      <FieldLabel htmlFor={`${FORM_ID}-dis-true`}>FieldLabel Disabled checked</FieldLabel>
                      <FieldDescription>FieldDescription: When disabled.</FieldDescription>
                    </FieldContent>
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>

      <FieldGroup>
        <form.Field
          name="option"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <FieldSet>
                <FieldLegend>FieldLegend</FieldLegend>
                <FieldDescription>FieldDescription</FieldDescription>
                <RadioGroup name={field.name} value={field.state.value} onValueChange={field.handleChange}>
                  {planOptions.map((opt) => (
                    <Field orientation="horizontal" data-disabled={opt.disabled} key={opt.optionId}>
                      <RadioGroupItem value={opt.optionId} id={`${FORM_ID}-plan-${opt.optionId}`} disabled={opt.disabled} />
                      <FieldContent>
                        <FieldLabel htmlFor={`${FORM_ID}-plan-${opt.optionId}`}>{opt.label}</FieldLabel>
                        {opt.description && <FieldDescription>{opt.description}</FieldDescription>}
                      </FieldContent>
                    </Field>
                  ))}
                </RadioGroup>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </FieldSet>
            );
          }}
        />
      </FieldGroup>

      <Button type="submit">Submit</Button>
    </Form>
  );
};
