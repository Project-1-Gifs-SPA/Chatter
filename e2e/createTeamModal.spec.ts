import test, { expect } from "@playwright/test";
import { localHost, logInFn } from "./testsHelpFn.js";


// const localHost = 'http://localhost:5173/'


// const logInFn = async(page) =>{

//     await page.getByRole('button', { name: 'Sign in' }).click();
//     await page.getByLabel('Email address').click();
//     await page.getByLabel('Email address').fill('alekspasov@gmail.com');
//     await page.getByLabel('Email address').press('Tab');
//     await page.getByLabel('Password').fill('aleksandar');
//     await page.getByRole('button', { name: 'Sign in' }).click();
// }


test('should input the team name', async ({ page }) => {
    await page.goto(localHost);
    await page.goto(localHost+'welcome');
    // await page.getByRole('button', { name: 'Sign in' }).click();
    // await page.getByLabel('Email address').click();
    // await page.getByLabel('Email address').fill('alekspasov@gmail.com');
    // await page.getByLabel('Email address').press('Tab');
    // await page.getByLabel('Password').fill('aleksandar');
    // await page.getByRole('button', { name: 'Sign in' }).click();
    await logInFn(page);
    await page.getByLabel('navigation bar for teams with').locator('path').click();
    await page.getByRole('textbox').click();
  
    const testText = 'Sasho'
    await page.getByRole('textbox').fill(testText);
  
    await expect(page.getByRole('textbox')).toHaveValue(testText);
  });


test('should show me an error', async({page})=>{

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page);
    await page.getByLabel('navigation bar for teams with').locator('path').nth(1).click();
    await page.getByRole('textbox').click();
  
    const testText = 'a'
    await page.getByRole('textbox').fill(testText);
    await page.getByRole('button', { name: 'Add Team' }).click();

    await expect(page.getByText('Team name must be')).toBeVisible();

})


test('should open team modal', async({page})=>{

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page)
    await page.getByLabel('navigation bar for teams with').locator('path').nth(1).click();
    await page.getByRole('textbox').click();
  
    await expect(page.getByRole('textbox')).toBeVisible();

})