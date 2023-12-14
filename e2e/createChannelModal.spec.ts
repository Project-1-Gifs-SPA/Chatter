import test, { expect } from "@playwright/test";
import { localHost, logInFn } from "./testsHelpFn";


test('should open create channel modal', async ({ page }) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');

    await logInFn(page);
    await page.getByLabel('team name Team with Sasho').click();
    await page.getByLabel('Sidebar with create meetings').locator('svg').nth(2).click();

    await expect(page.getByLabel('Sidebar with create meetings').getByRole('textbox')).toBeVisible();
  });


  test('should have test text in input field', async ({ page }) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');

    await logInFn(page);
    await page.getByLabel('team name Team with Sasho').click();
    await page.getByLabel('Sidebar with create meetings').locator('svg').nth(2).click();

    const testText = 'Sasho'

    await page.getByLabel('Sidebar with create meetings').getByRole('textbox').fill(testText);
    await expect(page.getByLabel('Sidebar with create meetings').getByRole('textbox')).toHaveValue(testText)
  
  });


  test('show close create channel modal',async ({page}) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');

    await logInFn(page);
    await page.getByLabel('team name Team with Sasho').click();
    await page.getByLabel('Sidebar with create meetings').locator('svg').nth(2).click();
    await page.getByLabel('Sidebar with create meetings').getByRole('button', { name: 'Close' }).click();

    await expect(page.getByLabel('Sidebar with create meetings').getByRole('textbox')).toBeEnabled();
  });