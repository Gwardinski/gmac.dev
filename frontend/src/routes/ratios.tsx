import { Button, Card, CardBody, CardDescription, CardHeader, CardTitle, H1, H1Description, Input, P1 } from '@/components/gmac.ui';
import { Page } from '@/components/layout';
import { useVariantState } from '@/components/VariantToggle';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';

const MIN_VALUE = 1;
const MAX_VALUE = 1000;

type Slider = {
  name: string;
  value: number;
};

export const Route = createFileRoute('/ratios')({
  component: RatiosRoute
});

function RatiosRoute() {
  const { variant } = useVariantState();
  const form = useForm({
    defaultValues: {
      masterValue: 100,
      newSliderName: '',
      sliders: [] as Slider[]
    },
    onSubmit: async () => {}
  });

  const clampValue = (value: number, max: number = MAX_VALUE) => Math.max(MIN_VALUE, Math.min(max, value));

  return (
    <Page>
      <Card as="header" variant={variant} theme="gray">
        <CardHeader column>
          <H1>Ratios</H1>
          <H1Description>Because I needed some simple ratio sliders.</H1Description>
        </CardHeader>
      </Card>

      <Card variant={variant}>
        <CardHeader>
          <CardTitle>Allocation Builder</CardTitle>
          <CardDescription>Set a Master Value, and add sliders that can set ratios based on that master.</CardDescription>
          <CardDescription>Budgeting, recipes... etc</CardDescription>
        </CardHeader>
        <CardBody>
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
            }}>
            <form.Field name="masterValue">
              {(field) => (
                <label className="flex w-full max-w-xl flex-col gap-2">
                  <P1>Master Value</P1>
                  <Input
                    type="number"
                    min={MIN_VALUE}
                    max={MAX_VALUE}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const nextMasterValue = clampValue(Number(event.target.value));
                      field.handleChange(nextMasterValue);
                      form.setFieldValue(
                        'sliders',
                        form.state.values.sliders.map((slider) => ({
                          ...slider,
                          value: clampValue(slider.value, nextMasterValue)
                        }))
                      );
                    }}
                  />
                </label>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => state.values}>
              {(values) => {
                const total = values.sliders.reduce((sum, current) => sum + current.value, 0);
                const isOverBudget = total > values.masterValue;

                const updateSlider = (index: number, nextValue: number) => {
                  const nextSliders = [...values.sliders];
                  nextSliders[index] = { ...nextSliders[index], value: clampValue(nextValue, values.masterValue) };
                  form.setFieldValue('sliders', nextSliders);
                };

                const addSlider = () => {
                  const sliderName = values.newSliderName.trim();
                  if (!sliderName) return;
                  form.setFieldValue('sliders', [...values.sliders, { name: sliderName, value: MIN_VALUE }]);
                  form.setFieldValue('newSliderName', '');
                };

                const removeSlider = (index: number) => {
                  if (values.sliders.length <= 1) return;
                  form.setFieldValue(
                    'sliders',
                    values.sliders.filter((_, sliderIndex) => sliderIndex !== index)
                  );
                };

                return (
                  <>
                    <div className="flex flex-wrap items-center gap-4">
                      <P1 className={isOverBudget ? 'text-red-500 dark:text-red-400' : ''}>Total: {total}</P1>
                      <P1>Remaining: {values.masterValue - total}</P1>
                    </div>

                    <div className="flex flex-col gap-4">
                      {values.sliders.map((slider, index) => (
                        <div key={`slider-${index}`} className="flex flex-col gap-2 rounded-lg border border-gray-300 p-3 dark:border-gray-700">
                          <div className="flex items-center justify-between gap-4">
                            <P1>
                              {slider.name}: {slider.value}
                            </P1>
                            <Button type="button" variant="outline" size="sm" onClick={() => removeSlider(index)} disabled={values.sliders.length <= 1}>
                              Remove
                            </Button>
                          </div>
                          <Input type="range" min={MIN_VALUE} max={values.masterValue} value={slider.value} onChange={(event) => updateSlider(index, Number(event.target.value))} />
                        </div>
                      ))}
                    </div>

                    <div className="flex w-full max-w-xl flex-wrap items-end gap-2">
                      <form.Field name="newSliderName">
                        {(field) => (
                          <label className="flex min-w-52 flex-1 flex-col gap-1">
                            <P1>New Slider</P1>
                            <Input type="text" value={field.state.value} onBlur={field.handleBlur} onChange={(event) => field.handleChange(event.target.value)} />
                          </label>
                        )}
                      </form.Field>
                      <Button type="button" onClick={addSlider} disabled={!values.newSliderName.trim()}>
                        Add Slider
                      </Button>
                    </div>
                  </>
                );
              }}
            </form.Subscribe>
          </form>
        </CardBody>
      </Card>
    </Page>
  );
}
