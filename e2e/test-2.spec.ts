import { test, expect } from '@playwright/test';

test('should open create channel modal', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.goto('http://localhost:5173/welcome');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByLabel('Email address').click();
  await page.getByLabel('Email address').fill('alekspasov@gmail.com');
  await page.getByLabel('Email address').press('Tab');
  await page.getByLabel('Password').fill('aleksandar');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByLabel('team name Team with Sasho').click();
  await page.getByLabel('Sidebar with create meetings').locator('svg').nth(2).click();
  await page.getByLabel('Sidebar with create meetings').getByRole('textbox').click();
  await page.getByLabel('Sidebar with create meetings').getByRole('textbox').fill('Test');
  await page.getByLabel('Sidebar with create meetings').getByRole('button', { name: 'Close' }).click();
});