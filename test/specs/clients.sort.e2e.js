import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import ClientsPage from '../pageobjects/clients.page.js';


const byText = (a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' });
const byNumber = (a, b) => Number(a) - Number(b);

function expectedOrder (values, compare, direction) {
    const sorted = [...values].sort(compare);
    return direction === 'ascending' ? sorted : sorted.reverse();
}

describe('theCaseWork - Clients page column sorting', () => {
    before(async () => {
        await LoginPage.open();
        await LoginPage.login(process.env.CASEWORK_USERNAME, process.env.CASEWORK_PASSWORD);
    });

    beforeEach(async () => {
        await ClientsPage.open();
        await ClientsPage.waitForRows();
    });

    const columns = [
        { name: 'Name', compare: byText },
        { name: 'Active Case Count', compare: byNumber }
    ];

    for (const column of columns) {
        for (const direction of ['ascending', 'descending']) {
            it(`should sort ${column.name} ${direction}`, async () => {
                await ClientsPage.sortBy(column.name, direction);

                
                expect(await ClientsPage.getSortState(column.name)).toBe(direction);

                
                const actual = await ClientsPage.getColumnValues(column.name);
                expect(actual).toEqual(expectedOrder(actual, column.compare, direction));
            });
        }
    }

    // Address is tested on its own because clients without an address show a
    // blank cell. We skip the blanks and check the clients that DO have a
    // street are in order (the app sorts by the street line only).
    for (const direction of ['ascending', 'descending']) {
        it(`should sort Address ${direction} (clients with a street)`, async () => {
            await ClientsPage.sortBy('Address', direction);

            expect(await ClientsPage.getSortState('Address')).toBe(direction);

            const streets = (await ClientsPage.getAddressStreetLines())
                .filter(street => street !== '');
            expect(streets).toEqual(expectedOrder(streets, byText, direction));
        });
    }
});
