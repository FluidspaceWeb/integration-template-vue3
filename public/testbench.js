(function () {
    const config = JSON.parse(document.getElementById('config').text);
    const moduleConfig = config.module;

    window.App = {
        'Bus': Bus(),
        'ModuleConfigs': {},
        'Modules': {},
        'Integration': {
            triggerAddAccount() {
                App.Bus.emit('INTEGRATION/sysASP-add-account', moduleConfig.id, {'access_type': 'private'});
            },
            getAllAccounts() {
                const API = new IntegrationAPI(moduleConfig.id);
                API.getAccounts('private')
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((err) => {
                        console.error('An error occurred while fetching accounts', err);
                    });
            }
        },
        'Workspace': {
            'user': {
                "_id": "yAWWJyjabBT8EdWBg0lR",
                "fname": "John",
                "lname": "Doe",
                "email": "alltimejohndoe@domain.tld",
                "img": config.serverUrl + '/images/user_default.jpg'
            }
        }
    };
    App.Bus.add('INTEGRATION/sysASP-add-account');
    App.Bus.add('INTEGRATION/sysASP-select-account');

    const mod_fullname = (moduleConfig.namespace + '_' + moduleConfig.name).toLowerCase();
    const tagName = 'module-' + mod_fullname;
    
    let moduleDiv = document.createElement('div');
        moduleDiv.className = 'module';
    let moduleDom = `
			<${tagName}
				class="moduleElement"
				data-mid="${moduleConfig.id}"
				view-select="9"
				period-start=""
				period-end="">
			</${tagName}>
    `;
    moduleDiv.innerHTML = moduleDom;
    document.body.appendChild(moduleDiv);

    //REST IS FILLED WITH DUMMY DATA
    const modules = document.getElementsByTagName(tagName);

    for (let i = 0; i < modules.length; i++) {
        let mod = modules[i];

        mod.addEventListener("register-app", (args) => {
            const detail = args["detail"][0];
            let dummy_config = {
                id: detail['id'],
                title: moduleConfig.displayName,
                namespace: moduleConfig.namespace,
                mod_name: moduleConfig.name,
                tag: tagName,
                isVanillaJs: false,
                min_width: 3,
                min_height: 2,
            };

            const randomPageId = 'page_' + (i + 1);
            window.App['Modules'][randomPageId] = {};

            window.App['ModuleConfigs'][detail['id']] = dummy_config;
            window.App['Modules'][randomPageId][detail['id']] = detail;
            console.log('-> testbench conf loaded');

            // INITIALISE THE MODULE
            console.log('-> invoking module init()');
            detail.init(IntegrationModule(detail['id']));
        });

        mod.addEventListener("show-toast", (args) => {
            args.stopPropagation();
            console.log("Event show-toast args: ", args['detail']);
            alert(`Toast [${args['detail'][0]['severity_type']}]\r\n\r\n${args['detail'][0]['message']}`);
        });
    }

    // trigger auto account selection for development purpose only
    if(config.autoSelectAccount.enabled === true) {
        setTimeout(() => {
            App.Bus.emit('INTEGRATION/sysASP-select-account', moduleConfig.id, {
                account_id: config.autoSelectAccount.id,
                access_type: 'private'
            });
            console.log('Account auto-selected');
        }, config.autoSelectAccount.delayMS);
    }
})();
