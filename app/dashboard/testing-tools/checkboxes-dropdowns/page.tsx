'use client';

import { useState } from 'react';
import { ToolLayout } from '../tool-layout';
import { PlaywrightRunner } from '@/components/testing-tools/playwright-runner';

const FRUITS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
const COUNTRIES = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'Japan'];
const CITIES: Record<string, string[]> = {
  India: ['Delhi', 'Mumbai', 'Bangalore'],
  USA: ['New York', 'San Francisco', 'Chicago'],
  UK: ['London', 'Manchester', 'Birmingham'],
  Canada: ['Toronto', 'Vancouver', 'Montreal'],
  Australia: ['Sydney', 'Melbourne', 'Brisbane'],
  Germany: ['Berlin', 'Munich', 'Hamburg'],
  Japan: ['Tokyo', 'Osaka', 'Kyoto'],
};

const STARTER_CODE = `// Test: Check fruits, select country & city, submit form
await page.getByTestId('checkbox-apple').check();
await page.getByTestId('checkbox-cherry').check();

// Verify 2 fruits selected
await expect(page.getByTestId('checked-count')).toContainText('2 selected');

// Select country and city
await page.getByTestId('country-select').selectOption('India');
await page.getByTestId('city-select').selectOption('Mumbai');

// Verify location display
await expect(page.getByTestId('location-display')).toContainText('Mumbai, India');

// Agree to terms and submit
await page.getByTestId('agree-terms').check();
await page.getByTestId('submit-button').click();

// Verify summary
await expect(page.getByTestId('form-summary')).toBeVisible();`;

export default function CheckboxesDropdownsTool() {
  const [checkedFruits, setCheckedFruits] = useState<Set<string>>(new Set());
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [experience, setExperience] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  const toggleFruit = (fruit: string) => {
    setCheckedFruits((prev) => {
      const next = new Set(prev);
      if (next.has(fruit)) next.delete(fruit);
      else next.add(fruit);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setCheckedFruits(new Set());
    } else {
      setCheckedFruits(new Set(FRUITS));
    }
    setSelectAll(!selectAll);
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedCity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setCheckedFruits(new Set());
    setSelectedColor('');
    setSelectedCountry('');
    setSelectedCity('');
    setAgreeTerms(false);
    setNewsletter(false);
    setExperience('');
    setSubmitted(false);
    setSelectAll(false);
  };

  return (
    <ToolLayout
      title="Checkboxes & Dropdowns"
      description="Interact with checkboxes, radio buttons, single/cascading dropdowns, and form submission."
      difficulty="Beginner"
      scenarios={[
        'Check "Apple" and "Cherry" checkboxes and verify they are selected.',
        'Click "Select All" and verify all fruit checkboxes are checked.',
        'Uncheck "Select All" and verify all are unchecked.',
        'Select a color from the radio buttons and verify the selection.',
        'Select a country, then verify the city dropdown updates.',
        'Select India > Mumbai and verify the displayed selection.',
        'Check "I agree to terms" and "Subscribe to newsletter".',
        'Submit the form and verify the summary appears.',
        'Click "Reset" and verify all inputs clear.',
      ]}
    >
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        {/* Checkboxes */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Select your favorite fruits</h3>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              id="select-all"
              checked={selectAll}
              onChange={handleSelectAll}
              className="rounded border-slate-300"
              data-testid="select-all"
            />
            <label htmlFor="select-all" className="text-sm text-slate-700 font-medium">Select All</label>
          </div>
          <div className="space-y-2 ml-4">
            {FRUITS.map((fruit) => (
              <div key={fruit} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`fruit-${fruit}`}
                  checked={checkedFruits.has(fruit)}
                  onChange={() => toggleFruit(fruit)}
                  className="rounded border-slate-300"
                  data-testid={`checkbox-${fruit.toLowerCase()}`}
                />
                <label htmlFor={`fruit-${fruit}`} className="text-sm text-slate-700">{fruit}</label>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-2" data-testid="checked-count">
            {checkedFruits.size} selected
          </p>
        </div>

        {/* Radio Buttons */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Choose a color</h3>
          <div className="flex flex-wrap gap-4">
            {['Red', 'Blue', 'Green', 'Yellow'].map((color) => (
              <div key={color} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="color"
                  id={`color-${color}`}
                  value={color}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                  className="border-slate-300"
                  data-testid={`radio-${color.toLowerCase()}`}
                />
                <label htmlFor={`color-${color}`} className="text-sm text-slate-700">{color}</label>
              </div>
            ))}
          </div>
          {selectedColor && (
            <p className="text-xs text-slate-500 mt-2" data-testid="selected-color">Selected: {selectedColor}</p>
          )}
        </div>

        {/* Cascading Dropdowns */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Cascading Dropdowns</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                data-testid="country-select"
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedCountry}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm disabled:bg-slate-100 disabled:text-slate-400"
                data-testid="city-select"
              >
                <option value="">Select city</option>
                {selectedCountry && CITIES[selectedCountry]?.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          {selectedCountry && selectedCity && (
            <p className="text-xs text-slate-500 mt-2" data-testid="location-display">
              Location: {selectedCity}, {selectedCountry}
            </p>
          )}
        </div>

        {/* Experience Dropdown */}
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-2">Experience Level</h3>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            data-testid="experience-select"
          >
            <option value="">Select experience</option>
            <option value="beginner">Beginner (0-1 years)</option>
            <option value="intermediate">Intermediate (1-3 years)</option>
            <option value="senior">Senior (3+ years)</option>
          </select>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="terms" checked={agreeTerms} onChange={() => setAgreeTerms(!agreeTerms)} className="rounded border-slate-300" data-testid="agree-terms" />
            <label htmlFor="terms" className="text-sm text-slate-700">I agree to the terms and conditions</label>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="news" checked={newsletter} onChange={() => setNewsletter(!newsletter)} className="rounded border-slate-300" data-testid="subscribe-newsletter" />
            <label htmlFor="news" className="text-sm text-slate-700">Subscribe to newsletter</label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button type="submit" className="flex-1 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700" data-testid="submit-button">
            Submit
          </button>
          <button type="button" onClick={handleReset} className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50" data-testid="reset-button">
            Reset
          </button>
        </div>

        {/* Summary */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm" data-testid="form-summary">
            <h4 className="font-semibold text-green-800 mb-2">Form Submitted!</h4>
            <ul className="space-y-1 text-slate-700">
              <li data-testid="summary-fruits">Fruits: {checkedFruits.size > 0 ? Array.from(checkedFruits).join(', ') : 'None'}</li>
              <li data-testid="summary-color">Color: {selectedColor || 'None'}</li>
              <li data-testid="summary-location">Location: {selectedCity ? `${selectedCity}, ${selectedCountry}` : 'Not selected'}</li>
              <li data-testid="summary-experience">Experience: {experience || 'Not selected'}</li>
              <li data-testid="summary-terms">Terms: {agreeTerms ? 'Agreed' : 'Not agreed'}</li>
              <li data-testid="summary-newsletter">Newsletter: {newsletter ? 'Subscribed' : 'Not subscribed'}</li>
            </ul>
          </div>
        )}
      </form>

      {/* Playwright Code Editor */}
      <PlaywrightRunner starterCode={STARTER_CODE} />
    </ToolLayout>
  );
}
