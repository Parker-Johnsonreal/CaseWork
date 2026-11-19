import Page from './page.js';


 //Clients / 3rd Parties page
 // https://app.thecasework.com/account/clientsParties
 
 

const COLUMN_INDEX = {
    'Name': 1,
    'Address': 2,
    'Active Case Count': 3
};

class ClientsPage extends Page {
    
    get navClients () {
        return $('[data-testid="vert-nav-clients-parties"]');
    }

    get pageTitle () {
        return $('h1*=Clients');
    }

    get searchInput () {
        return $('input[placeholder^="Search Clients"]');
    }

    get columnHeaders () {
        return $$('[role="columnheader"]');
    }

    get rows () {
        
        return $$('[role="grid"] [role="row"]:not(:first-child)');
    }

   
    open () {
        return super.open('account/clientsParties');
    }

    async waitForRows () {
        await browser.waitUntil(
            async () => (await this.rows.length) > 0,
            { timeout: 15000, timeoutMsg: 'Client rows never loaded' }
        );
    }

    
    async getHeader (columnName) {
        for (const header of await this.columnHeaders) {
            if ((await header.getText()).trim() === columnName) {
                return header;
            }
        }
        throw new Error(`Column header "${columnName}" not found`);
    }

    
    async getSortState (columnName) {
        const header = await this.getHeader(columnName);
        return header.getAttribute('aria-sort');
    }

    
     
     // @param {string} columnName
     // @param {string} direction
     
    async sortBy (columnName, direction) {
        for (let clicks = 0; clicks < 3; clicks++) {
            if (await this.getSortState(columnName) === direction) {
                return;
            }
            const header = await this.getHeader(columnName);
            await header.$('[role="button"]').click();
            await browser.pause(500); 
        }
        throw new Error(`Could not sort "${columnName}" ${direction}`);
    }

    
    async getColumnValues (columnName) {
        const index = COLUMN_INDEX[columnName];
        const values = [];
        for (const row of await this.rows) {
            const cell = (await row.$$('[role="gridcell"]'))[index];
            if (columnName === 'Name') {
                
                values.push(await cell.$('span[title]').getAttribute('title'));
            } else {
                values.push((await cell.getText()).trim());
            }
        }
        return values;
    }

    // Returns only the street (first line) of each address.
    // The app sorts the Address column by the street line, not the full address.
    // innerText keeps the leading line break, so a blank street stays blank.
    async getAddressStreetLines () {
        const index = COLUMN_INDEX['Address'];
        const streets = [];
        for (const row of await this.rows) {
            const cell = (await row.$$('[role="gridcell"]'))[index];
            const text = await cell.getProperty('innerText');
            streets.push(text.split('\n')[0].trim());
        }
        return streets;
    }
}

export default new ClientsPage();
