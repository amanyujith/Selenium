import Keycloak from 'keycloak-js';
// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
function getSubDomain() {
	const host = window.location.hostname;
	// 
	// const host = 'rahul.hoolva.com/app';
	// const host = 'hoolva.com/app';
	// const host = 'rahul.us3-server-node0.hoolva.com';
	let real = 'system'
	let sub = host.split('.')
	if (sub.length > 2) {
		real = sub[0];
	}
	return real;
}
const tenant = getSubDomain()

const keycloak = new Keycloak({
  // url: 'https://us2-cluster.hoolva.com/auth/',
  // realm: 'Hoolva',
  // realm: 'Hoolva',
  url: "https://us1dev-ncs.kanimango.com/auth",
  // url: 'https://us6-cluster.hoolva.com/auth/',
  realm: "ncs",
  // url: 'https://us4-cluster.hoolva.com/auth/',
  // realm: 'System_Tenant',
  // url: 'https://us3-server-node0.hoolva.com/sso/'
  clientId: "ncs",
});

export default keycloak;
