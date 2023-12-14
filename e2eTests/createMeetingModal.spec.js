import test, { expect } from "@playwright/test";
import { localHost, logInFn } from "./testsHelpFn.js";


test('should open create meeting modal',async ({page}) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');

    await logInFn(page);
    
    await page.getByLabel('team name Fun Place').click();
    await page.getByRole('button', { name: 'Create Meeting' }).click();

    await expect(page.getByPlaceholder('Enter meeting topic')).toBeVisible()   ; 
  });


  test('should close create meeting modal',async ({page}) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page);
    
    await page.getByLabel('team name Fun Place').click();
    await page.getByRole('button', { name: 'Create Meeting' }).click();
    await page.locator('#myModal').getByRole('button', { name: 'Close' }).click();

    await expect(page.locator('#myModal')).toBeHidden();
    
  });

  test('should add test text to input field',async ({page}) => {
    await page.goto(localHost);
    await page.goto(localHost + 'welcome');

    await logInFn(page);
    
    await page.getByLabel('team name Fun Place').click();
    await page.getByRole('button', { name: 'Create Meeting' }).click();

    const testText = "Test Meeting"

    await page.getByPlaceholder('Enter meeting topic').fill(testText);
    await expect(page.getByPlaceholder('Enter meeting topic')).toHaveValue(testText);
  });


