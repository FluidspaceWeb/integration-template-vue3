<template>
	<img src="@/assets/logo.png" width="40" height="40">
	<h1>Hello World</h1>
</template>

<script setup>
import { onMounted, provide, computed } from 'vue';
import Factory from '@/shared/Factory';

/* 
	DEFINITIONS
*/
defineOptions({
	inheritAttrs: false
});

const props = defineProps({
	'viewSelect': String,
	'periodStart': String,
	'periodEnd': String
});

const emit = defineEmits([
	'register-app',
	'show-toast'
]);

/** @type {IntegrationGlue} */
let _integration;
const _MODULE_ID = '2wroqKErOQtGY5NVjw14';
const FACTORY = Factory(_MODULE_ID, emit);
provide('FACTORY', FACTORY);



// === HOOKS ===
onMounted(() => {
	emit('register-app', {
		id: _MODULE_ID,
		namespace: 'namespace', // SET THIS
		mod_name: 'modulename', // SET THIS
		init: init,
		refresh: refresh
	});
});



// === STATE VARS ===
const viewPermSelect = computed(() => {
	if (props.viewSelect !== undefined) {
		let perm = parseInt(props.viewSelect, 10);
		if (!Number.isNaN(perm)) {
			return perm;
		}
	}
	return 0;
});



// === METHODS ===
/**
 * Initialise the module
 * @param {IntegrationGlue} integrationGlue - contains properties and methods required by your module to glue with the environment
 */
function init(integrationGlue) {
	FACTORY.set.integrationGlue(integrationGlue);
	_integration = integrationGlue;

	// === IF USING OAUTH2 ===
	_integration.subscribe.onAccountSelect(handler_selectAccount);
	_integration.subscribe.onAddAccount(handler_addAccount);
}



function refresh() {
	// TODO: implement a refresh method to re-fetch and display the fresh data.
}



/**
 * === IF USING OAUTH2 ===
 * This handler is invoked when user clicks add account in the environment.
 * The adding of account is fully handled by Fluidspace but process must be initiated by the module using specific auth_config_name.
 * @param {object} detail
 * @param {string} detail.access_type
 */
 function handler_addAccount(detail) {
	/*
	 * Generally, your integration may support authentication only via one method, so just forwarding
	 * to environment via _integration.account.add(<access_type>, <auth_provider_name> is sufficient.
	 * If your integration supports multiple auths then showing a auth selection screen is recommended.
	 * Every auth option may have different config which can be used by specifying appropriate <auth_config_name>.
	 */

	_integration.account.add(detail.access_type, '<auth_config_name>')
		.then(() => {console.log('Account added!');})
		.catch(() => {console.error('An error occurred while adding account!');});
}

/**
 * === IF USING OAUTH2 ===
 * Handles the event received from host when user selects account from dropdown
 * @param {object} account
 * @param {string} account.account_id
 * @param {string} account.access_type
 */
function handler_selectAccount(account) {
	FACTORY.set.account(account.account_id, account.access_type);

	// TODO: Fetch and initialise the module data for the selected account.
	// Ensure to clear data and state of previous account if any.
}






/**
 * Glue object to interface module with Fluidspace environment
 * @typedef {Object} IntegrationGlue
 * @prop {DirectRequest} directRequest
 * @prop {IntegrationGlueAccount} account
 * @prop {function} getConfig
 * @prop {GlueRTMethods} subscribe
 * @prop {GlueRTMethods} unsubscribe
 */
/**
 * Make direct request to external REST API, credentials are auto-attached as required.
 * @typedef {Function} DirectRequest
 * @param {string} request_url - external API URL
 * @param {Headers} headers_object - additional headers for the request
 * @param {any} payload - the body of request, stringify if sending JSON.
 */
/**
 * @typedef {Object} IntegrationGlueAccount
 * @prop {Function} add - to invoke account adding flow
 * @prop {Function} clearSelected - deselect currently selected account
 * @prop {Function} getSelected - get selected account detail
 * @prop {Function} select - programmatically select account, not recommended.
 */
/**
 * Glue Realtime Methods
 * @typedef {object} GlueRTMethods
 * @prop {function} onAccountRemoved
 * @prop {function} onAccountSelect
 * @prop {function} onAddAccount
 */
</script>

<style type="text/css" src="@/assets/base.css" />
