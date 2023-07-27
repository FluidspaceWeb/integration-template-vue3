import { reactive, ref, readonly } from 'vue';

export default function (MODULE_ID, ROOT_EMIT) {
    let _INTEGRATION;
    const _STORE = reactive({
        'selectedAccount': {
            'id': '',
            'access_type': ''
        },
        // add your global state vars
    });

    /**
     * @param {'error' | 'warn' | 'info' | 'success'} severity_type
     * @param {string} message
     */
    function showToast(severity_type, message) {
        ROOT_EMIT('show-toast', { severity_type, message });
    }

    const set = {
        integrationGlue(integration_glue) {
            _INTEGRATION = integration_glue;
        },
        account(account_id, access_type) {
            _STORE.selectedAccount.id = account_id;
            _STORE.selectedAccount.access_type = access_type;
            _INTEGRATION.account.select(account_id, access_type); // informs host that account has been selected
        }
    };

    const get = {
        integrationGlue() {
            return _INTEGRATION;
        }
    };

    const actions = {};

    return {
        MODULE_ID,
        showToast,
        set,
        get,
        actions
    };
}
