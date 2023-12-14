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

    await expect(page.getByLabel('Sidebar with create meetings').getByRole('textbox')).toHaveValue('');
  });



  test('should show me an error', async ({ page }) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');

    await logInFn(page);
    await page.getByLabel('team name Team with Sasho').click();
    await page.getByLabel('Sidebar with create meetings').locator('svg').nth(2).click();

    const testText = 'a'

    await page.getByLabel('Sidebar with create meetings').getByRole('textbox').fill(testText);
    await page.getByRole('button', { name: 'Add Channel' }).click();
    await expect(page.getByText('Channel name must be between')).toBeVisible();
  
  });


  test('should show clicked channel', async ({page}) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');

    await logInFn(page);
    await page.getByLabel('team name Fun Place').click();
    await page.locator('div').filter({ hasText: /^Chat with Velko$/ }).click()
  
    await expect(page.getByRole('heading', { name: '# Chat with Velko' })).toBeVisible();
  });