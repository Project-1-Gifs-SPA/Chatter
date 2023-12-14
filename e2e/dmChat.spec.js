import test, { expect } from "@playwright/test";
import { localHost, logInFn } from "./testsHelpFn";




test('should show me gif search modal', async({page})=>{

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page)

    await page.locator('.ml-auto > div > .text-2xl').first().click();

    await expect(page.getByPlaceholder('Type something...')).toBeVisible();
    await page.locator('label:nth-child(3) > .w-6').click();

    await expect(page.locator('div').filter({ hasText: 'Search' }).nth(4)).toBeVisible();
});


test('should open dm chat', async({page})=>{

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page)

    await page.locator('.ml-auto > div > .text-2xl').first().click();

    await expect(page.getByPlaceholder('Type something...')).toBeVisible();

});


test('should open emoji picker', async({page})=>{

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page)

    await page.locator('.ml-auto > div > .text-2xl').first().click();
    await page.locator('div:nth-child(2) > button').first().click();

    await expect(page.getByText('Frequently used')).toBeVisible();

});

