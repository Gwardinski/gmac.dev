import { IconPlus, IconSearch } from '@tabler/icons-react';
import { useForm } from '@tanstack/react-form';
import { useState } from 'react';
import z from 'zod';
import { Alert, AlertDescription, AlertHeader, AlertTitle } from '../alert';
import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, Form } from '../field';
import { Input } from '../input';
import { InputAddon, InputGroup, InputGroupButton, InputGroupIconButton, InputGroupText, TextareaAddon } from '../input-group';
import { RadioGroup, RadioGroupItem } from '../radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import { TextAnchor } from '../text-button';
import { Textarea } from '../textarea';

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
  { optionId: '2', label: 'Label Option 3', description: 'Description Option 3' },
  { optionId: '3', label: 'Label Option 4', description: 'Description Option 4' }
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

const textareaControlClass = 'min-h-0 border-0 shadow-none ring-0 focus-visible:ring-0 dark:bg-transparent';

export const FormMockExample = () => {
  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="solid">solid</TabsTrigger>
        <TabsTrigger value="glass">Glass</TabsTrigger>
      </TabsList>
      <TabsContent value="solid">
        <FormExample variant="solid" />
      </TabsContent>
      <TabsContent value="glass">
        <FormExample variant="glass" />
      </TabsContent>
    </Tabs>
  );
};

const FormExample = ({ variant }: { variant: 'solid' | 'glass' }) => {
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
      data-form-variant={variant}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}>
      <FieldSet>
        <FieldLegend>FieldLegend: Input</FieldLegend>
        <FieldGroup>
          <form.Field name="username">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={`${FORM_ID}-username`}>FieldLabel: Username</FieldLabel>
                  <Input
                    id={`${FORM_ID}-username`}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Hal Jordan"
                    autoComplete="off"
                  />
                  <FieldError errors={field.state.meta.errors} />
                  <FieldDescription>FieldDescription: Choose a unique username.</FieldDescription>
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="password">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={`${FORM_ID}-password`}>FieldLabel: Password</FieldLabel>
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
                  <FieldDescription>FieldDescription: Must be at least 8 characters.</FieldDescription>
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>FieldLegend: InputGroup</FieldLegend>
        <FieldDescription>FieldDescription: InputGroup with addons</FieldDescription>
        <FieldGroup>
          <form.Field name="websitePath">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel htmlFor={`${FORM_ID}-website`}>Site path</FieldLabel>
                  <InputGroup>
                    <InputAddon>
                      <InputGroupText>https://</InputGroupText>
                    </InputAddon>
                    <Input
                      id={`${FORM_ID}-website`}
                      variant="group"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="yoursite.com"
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
                  <FieldLabel htmlFor={`${FORM_ID}-lookup`}>Lookup</FieldLabel>
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
                      placeholder="Search…"
                    />
                    <InputAddon align="right">
                      <InputGroupButton type="button">Go</InputGroupButton>
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
        <FieldLegend>Textarea &amp; addons</FieldLegend>
        <FieldGroup>
          <form.Field name="notes">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`${FORM_ID}-notes`}>Notes</FieldLabel>
                <InputGroup>
                  <TextareaAddon align="top">
                    <InputGroupText>Top addon</InputGroupText>
                  </TextareaAddon>
                  <Textarea
                    id={`${FORM_ID}-notes`}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Notes…"
                    rows={2}
                    className={textareaControlClass}
                  />
                </InputGroup>
              </Field>
            )}
          </form.Field>
          <form.Field name="reply">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`${FORM_ID}-reply`}>Reply</FieldLabel>
                <InputGroup>
                  <Textarea
                    id={`${FORM_ID}-reply`}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Reply…"
                    rows={2}
                    className={textareaControlClass}
                  />
                  <TextareaAddon align="bottom">
                    <InputGroupText>Bottom addon</InputGroupText>
                  </TextareaAddon>
                </InputGroup>
              </Field>
            )}
          </form.Field>
          <form.Field name="attachmentNote">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={`${FORM_ID}-attach`}>Attachment hint</FieldLabel>
                <InputGroup className="h-auto">
                  <Textarea
                    id={`${FORM_ID}-attach`}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="With right addon"
                    rows={2}
                    className={`flex-1 ${textareaControlClass}`}
                  />
                  <TextareaAddon align="right">
                    <InputGroupIconButton type="button" theme="gray" variant="ghost" aria-label="Attach">
                      <IconPlus />
                    </InputGroupIconButton>
                  </TextareaAddon>
                </InputGroup>
              </Field>
            )}
          </form.Field>
        </FieldGroup>
      </FieldSet>

      <FieldGroup>
        <FieldSet>
          <FieldLegend>FieldLegend: Checkboxes</FieldLegend>
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
                        FieldLabel: I agree to the{' '}
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
                      <FieldLabel htmlFor={`${FORM_ID}-checkbox1`}>FieldLabel: I agree to this.</FieldLabel>
                      <FieldError errors={field.state.meta.errors} />
                      <FieldDescription>FieldDescription: description of consent.</FieldDescription>
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
                      <FieldLabel htmlFor={`${FORM_ID}-dis-false`}>Disabled unchecked</FieldLabel>
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
                    <FieldLabel htmlFor={`${FORM_ID}-dis-true`}>Disabled checked (label only)</FieldLabel>
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
                <FieldLegend>FieldLegend: Radio</FieldLegend>
                <FieldDescription>FieldDescription: Radio description.</FieldDescription>
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
