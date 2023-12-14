import { test, expect } from '@playwright/test';

test('should input the team name', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/welcome');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('alekspasov@gmail.com');
  await page.getByLabel('Email address').press('Tab');
  await page.getByLabel('Password').fill('aleksandar');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByLabel('navigation bar for teams with').locator('svg').click();
  await page.getByRole('textbox').click();

  const testText = 'Sasho'
  await page.getByRole('textbox').fill(testText);

  await expect(page.getByRole('textbox')).toHaveValue(testText)
});