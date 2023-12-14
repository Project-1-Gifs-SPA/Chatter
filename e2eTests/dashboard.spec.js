import test, { expect } from "@playwright/test";
import { localHost, logInFn } from "./testsHelpFn.js";

test('should show online friends tab in dashboard', async ({ page }) => {

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page);

    await page.getByRole('button', { name: 'Online' }).click();
    await expect(page.getByRole('heading', { name: 'Online friends -' })).toBeVisible();

});


test('should show all friends tab in dashboard', async ({ page }) => {

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page);

    await page.getByRole('button', { name: 'All' }).click();
    await expect(page.getByRole('heading', { name: 'All friends -' })).toBeVisible();

});


test('should show empty friend request tab in dashboard', async ({ page }) => {

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page);

    await page.getByRole('button', { name: 'Friend Requests' }).click()
    await expect(page.getByText('You have no friend requests.')).toBeVisible();

});


test('should show search bar in dashboard', async ({ page }) => {

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page);

    await page.getByLabel('friends navigation bar with').getByRole('button').nth(3).click()
    await expect(page.getByPlaceholder('Search by username...')).toBeVisible();

});

test('should show virtual buddy tab in dashboard', async ({ page }) => {

    await page.goto(localHost);
    await page.goto(localHost + 'welcome');
    await logInFn(page);

    await page.getByRole('button', { name: 'vBuddy' }).click()
    await expect(page.getByLabel('chat bubble from vBuddy that')).toBeVisible();

});



