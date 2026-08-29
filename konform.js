const FORM_FIELDS = ['siteName','legalForm','registre','address','email','phone','hostName','hostAddress','declaration','dpo','retention','payOther'];
const CHECK_FIELDS = ['cContact','cCookies','cAccounts','cPayment','cNewsletter','cThirdParty',
  'payCinetpay','payFedapay','payKkiapay','payPaydunya','payStripe','payPaypal','payWave','payMomo'];

const PAY_LABELS = {
  payCinetpay: 'CinetPay',
  payFedapay: 'FedaPay',
  payKkiapay: 'Kkiapay',
  payPaydunya: 'PayDunya',
  payStripe: 'Stripe',
  payPaypal: 'PayPal',
  payWave: 'Wave',
  payMomo: 'Mobile Money (Orange, MTN, Moov)'
};
const PAY_URLS = {
  payCinetpay: 'https://cinetpay.com/politique-de-confidentialite',
  payFedapay: 'https://www.fedapay.com/conditions-generales-dutilisation/',
  payKkiapay: 'https://kkiapay.me',
  payPaydunya: 'https://paydunya.com',
  payStripe: 'https://stripe.com/fr/privacy',
  payPaypal: 'https://www.paypal.com/webapps/mpp/ua/privacy-full',
  payWave: 'https://www.wave.com',
  payMomo: null
};

function val(id){ const el = document.getElementById(id); return el ? el.value.trim() : ""; }
function checked(id){ const el = document.getElementById(id); return el ? el.checked : false; }

function saveFormState(country){
  const state = { country };
  FORM_FIELDS.forEach(id => { const el = document.getElementById(id); if(el) state[id] = el.value; });
  CHECK_FIELDS.forEach(id => { const el = document.getElementById(id); if(el) state[id] = el.checked; });
  try { localStorage.setItem('konform-form', JSON.stringify(state)); } catch(e){}
}

function restoreFormState(){
  try {
    const raw = localStorage.getItem('konform-form');
    if(!raw) return null;
    return JSON.parse(raw);
  } catch(e){ return null; }
}

function applyFormState(state){
  if(!state) return;
  FORM_FIELDS.forEach(id => { const el = document.getElementById(id); if(el && state[id] !== undefined) el.value = state[id]; });
  CHECK_FIELDS.forEach(id => { const el = document.getElementById(id); if(el && state[id] !== undefined) el.checked = state[id]; });
}

function selectedPayProviders(){
  const list = [];
  Object.keys(PAY_LABELS).forEach(id => { if(checked(id)) list.push({ name: PAY_LABELS[id], url: PAY_URLS[id] }); });
  const other = val('payOther');
  if(other) other.split(',').map(s => s.trim()).filter(Boolean).forEach(n => list.push({ name: n, url: null }));
  return list;
}

function collectedList(){
  const items = [];
  if(checked('cContact')) items.push("les informations transmises via le formulaire de contact (nom, email, message)");
  if(checked('cCookies')) items.push("des données de navigation collectées par cookies et outils de mesure d'audience");
  if(checked('cAccounts')) items.push("les données de compte utilisateur (identifiant, email, mot de passe chiffré)");
  if(checked('cPayment')) items.push("les données nécessaires au traitement des paiements en ligne (nom, email de facturation, montant), transmises directement à notre prestataire de paiement — nous ne stockons jamais vos numéros de carte bancaire");
  if(checked('cNewsletter')) items.push("l'adresse email fournie lors de l'inscription à la newsletter");
  if(checked('cThirdParty')) items.push("des données transmises à des outils tiers (statistiques, pixels publicitaires, messagerie WhatsApp Business)");
  return items.length ? items : ["aucune donnée personnelle en dehors de la navigation strictement technique"];
}

function processorsList(){
  const items = [];
  const hostName = val('hostName');
  items.push(hostName ? `notre hébergeur (${hostName})` : "notre hébergeur");
  if(checked('cCookies') || checked('cThirdParty')) items.push("nos outils de mesure d'audience (ex. Google Analytics)");
  if(checked('cThirdParty')) items.push("nos outils de messagerie et de suivi (ex. Meta Pixel, WhatsApp Business)");
  if(checked('cPayment')){
    const providers = selectedPayProviders();
    if(providers.length) items.push("nos prestataires de paiement : " + providers.map(p => p.name).join(", "));
    else items.push("notre prestataire de paiement en ligne");
  }
  return items;
}

function genMentionsLegales(c){
  const name = val('siteName') || "Ce site";
  const form = val('legalForm');
  const registre = val('registre');
  const address = val('address');
  const email = val('email');
  const phone = val('phone');
  const hostName = val('hostName') || "[nom de l'hébergeur à compléter]";
  const hostAddress = val('hostAddress') || "[adresse de l'hébergeur à compléter]";
  const declaration = val('declaration');

  const lawLabel = c==='ci' ? "la loi n°2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel" : "la loi n°2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin (Livre 5), modifiée par la loi n°2020-35 du 6 janvier 2021";
  const authority = c==='ci' ? "l'Autorité de Régulation des Télécommunications/TIC de Côte d'Ivoire (ARTCI)" : "l'Autorité de Protection des Données à caractère Personnel (APDP)";
  const authoritySite = c==='ci' ? "artci.ci" : "apdp.bj";
  const declLine = declaration
    ? `Le présent traitement a fait l'objet d'une déclaration auprès de ${authority} sous le numéro ${declaration}.`
    : `Conformément à ${lawLabel}, tout traitement de données à caractère personnel doit faire l'objet d'une déclaration ou d'une autorisation préalable auprès de ${authority} (${authoritySite}).`;
  const jurisdiction = c==='ci' ? "les tribunaux compétents d'Abidjan, Côte d'Ivoire" : "les tribunaux compétents de Cotonou, Bénin";

  return `
  <h2>Mentions légales</h2>
  <div class="lawref">${c==='ci' ? "Côte d'Ivoire — Loi n°2013-450 du 19 juin 2013 — ARTCI" : "Bénin — Loi n°2017-20 portant Code du numérique — APDP"}</div>

  <h3>1. Éditeur du site</h3>
  <p>Le présent site est édité par <strong>${name}</strong>${form ? ", " + form.toLowerCase() : ""}${registre ? ", immatriculée sous le numéro " + registre : ""}, dont le siège est situé à ${address}.<br>
  Téléphone : ${phone}<br>Email : ${email}</p>

  <h3>2. Directeur de la publication</h3>
  <p>Le directeur de la publication est le représentant légal de ${name}, joignable aux coordonnées ci-dessus.</p>

  <h3>3. Hébergement</h3>
  <p>Le site est hébergé par ${hostName}, dont l'adresse est ${hostAddress}.</p>

  <h3>4. Propriété intellectuelle</h3>
  <p>L'ensemble des contenus présents sur ce site (textes, images, logos, éléments graphiques) est protégé par le droit de la propriété intellectuelle. Toute reproduction, représentation ou diffusion, totale ou partielle, sans autorisation préalable est interdite.</p>

  <h3>5. Protection des données à caractère personnel</h3>
  <p>${name} traite les données à caractère personnel de ses utilisateurs dans le respect de ${lawLabel}. ${declLine}<br>
  Pour plus de détails sur les données collectées, leurs finalités et vos droits, consultez notre <strong>Politique de confidentialité</strong>.</p>

  <h3>6. Cookies</h3>
  <p>Le site peut déposer des cookies sur votre navigateur. Vous pouvez à tout moment paramétrer votre navigateur pour refuser les cookies. Voir la Politique de confidentialité pour le détail des traceurs utilisés.</p>

  <h3>7. Limitation de responsabilité</h3>
  <p>${name} s'efforce d'assurer l'exactitude des informations diffusées sur le site mais ne saurait être tenu responsable des erreurs, omissions ou de l'indisponibilité temporaire du service. Le site peut contenir des liens vers des sites tiers dont ${name} ne maîtrise pas le contenu.</p>

  <h3>8. Droit applicable et juridiction compétente</h3>
  <p>Les présentes mentions légales sont soumises au droit ${c==='ci' ? "ivoirien" : "béninois"}. Tout litige relatif à l'utilisation du site relève de la compétence exclusive de ${jurisdiction}.</p>
  `;
}

function genPolitique(c){
  const name = val('siteName') || "Ce site";
  const email = val('email');
  const phone = val('phone');
  const address = val('address');
  const dpo = val('dpo');
  const retention = val('retention') || "24 mois";
  const declaration = val('declaration');
  const items = collectedList();
  const processors = processorsList();
  const payProviders = checked('cPayment') ? selectedPayProviders() : [];
  const usesForeignTools = checked('cThirdParty') || checked('cCookies') || checked('cPayment');

  const lawLabel = c==='ci' ? "la loi n\u00b02013-450 du 19 juin 2013 relative \u00e0 la protection des donn\u00e9es \u00e0 caract\u00e8re personnel" : "la loi n\u00b02017-20 du 20 avril 2018 portant Code du num\u00e9rique en R\u00e9publique du B\u00e9nin (Livre 5), modifi\u00e9e par la loi n\u00b02020-35 du 6 janvier 2021";
  const authority = c==='ci' ? "l'Autorit\u00e9 de R\u00e9gulation des T\u00e9l\u00e9communications/TIC de C\u00f4te d'Ivoire (ARTCI)" : "l'Autorit\u00e9 de Protection des Donn\u00e9es \u00e0 caract\u00e8re Personnel (APDP)";
  const authoritySite = c==='ci' ? "www.artci.ci" : "www.apdp.bj";
  const declLine = declaration
    ? `Ce traitement a \u00e9t\u00e9 d\u00e9clar\u00e9 aupr\u00e8s de ${authority} sous le num\u00e9ro ${declaration}.`
    : `Ce traitement fait l'objet, ou fera l'objet, d'une d\u00e9claration aupr\u00e8s de ${authority}, conform\u00e9ment \u00e0 ${lawLabel}.`;
  const responsable = dpo ? dpo : name;

  const rightsList = c==='ci'
    ? [
        "Droit \u00e0 l'information : \u00eatre inform\u00e9 de la collecte et de l'usage de vos donn\u00e9es",
        "Droit d'acc\u00e8s : obtenir la confirmation que vos donn\u00e9es sont trait\u00e9es et en obtenir une copie",
        "Droit de rectification : corriger toute donn\u00e9e inexacte ou incompl\u00e8te",
        "Droit \u00e0 l'effacement (suppression) : demander la suppression de vos donn\u00e9es",
        "Droit d'opposition : vous opposer, pour un motif l\u00e9gitime, \u00e0 un traitement",
        "Droit \u00e0 la portabilit\u00e9 : recevoir vos donn\u00e9es dans un format r\u00e9utilisable, ou les faire transmettre \u00e0 un autre responsable"
      ]
    : [
        "Droit d'acc\u00e8s : obtenir la confirmation que vos donn\u00e9es sont trait\u00e9es et en obtenir une copie",
        "Droit de rectification : corriger toute donn\u00e9e inexacte ou incompl\u00e8te",
        "Droit \u00e0 l'effacement : demander la suppression de vos donn\u00e9es",
        "Droit \u00e0 la limitation du traitement : demander que le traitement de vos donn\u00e9es soit limit\u00e9 dans certaines conditions",
        "Droit d'opposition : vous opposer, \u00e0 tout moment et pour un motif l\u00e9gitime, \u00e0 un traitement",
        "Droit \u00e0 la portabilit\u00e9 : demander que vos donn\u00e9es soient transmises \u00e0 un autre responsable, lorsque cela est techniquement possible"
      ];

  const exerciseRights = c==='ci'
    ? `Vous pouvez exercer ces droits en adressant une demande dat\u00e9e et sign\u00e9e \u00e0 ${email}${address ? " ou par voie postale \u00e0 " + address : ""}, accompagn\u00e9e d'une copie de votre pi\u00e8ce d'identit\u00e9. Nous y r\u00e9pondons dans les meilleurs d\u00e9lais.`
    : `Vous pouvez exercer ces droits en adressant une demande \u00e0 ${email}${address ? " ou par voie postale \u00e0 " + address : ""}, accompagn\u00e9e d'une copie de votre pi\u00e8ce d'identit\u00e9. Nous y r\u00e9pondons dans les meilleurs d\u00e9lais.`;

  const complaintLine = c==='ci'
    ? `Si vous estimez que vos droits ne sont pas respect\u00e9s, vous pouvez adresser une r\u00e9clamation \u00e0 ${authority} (${authoritySite}).`
    : `Sans pr\u00e9judice de tout autre recours, vous avez le droit d'introduire une r\u00e9clamation aupr\u00e8s de ${authority} (${authoritySite}) si vous estimez que le traitement de vos donn\u00e9es constitue une violation de vos droits, avec possibilit\u00e9 de recours juridictionnel si la r\u00e9clamation n'aboutit pas.`;

  const breachLine = c==='ci'
    ? `En cas d'incident de s\u00e9curit\u00e9 affectant vos donn\u00e9es personnelles, ${name} prend les mesures n\u00e9cessaires pour circonscrire l'incident et, lorsque la loi l'exige, en informe ${authority} ainsi que les personnes concern\u00e9es.`
    : `En cas de violation de donn\u00e9es susceptible de porter atteinte \u00e0 vos droits et libert\u00e9s, ${name} s'engage \u00e0 notifier ${authority} d\u00e8s la d\u00e9couverte de la violation, et \u00e0 informer les personnes concern\u00e9es lorsque la violation est susceptible d'engendrer un risque \u00e9lev\u00e9 pour leurs droits, conform\u00e9ment au Code du num\u00e9rique.`;

  // finalites / base legale table rows built from what the site collects
  const purposeRows = [];
  purposeRows.push(["Fournir et s\u00e9curiser le site, r\u00e9pondre \u00e0 vos demandes", "Ex\u00e9cution d'un contrat / int\u00e9r\u00eat l\u00e9gitime", "Donn\u00e9es de contact, donn\u00e9es de navigation"]);
  if(checked('cAccounts')) purposeRows.push(["G\u00e9rer votre compte utilisateur", "Ex\u00e9cution d'un contrat", "Donn\u00e9es de compte (identifiant, email)"]);
  if(checked('cPayment')) purposeRows.push(["Traiter vos paiements", "Ex\u00e9cution d'un contrat", "Donn\u00e9es de facturation et de transaction"]);
  if(checked('cCookies') || checked('cThirdParty')) purposeRows.push(["Mesurer l'audience et am\u00e9liorer le site", "Consentement / int\u00e9r\u00eat l\u00e9gitime", "Donn\u00e9es d'usage et d'analyse"]);
  if(checked('cNewsletter')) purposeRows.push(["Vous envoyer notre newsletter", "Consentement", "Adresse email"]);
  purposeRows.push(["Respecter nos obligations l\u00e9gales", "Obligation l\u00e9gale", "Toutes cat\u00e9gories concern\u00e9es"]);

  const purposeTable = `
  <table style="width:100%;border-collapse:collapse;font-family:-apple-system,sans-serif;font-size:12.5px;margin:6px 0 10px;">
    <thead><tr style="background:#f1efe8;">
      <th style="text-align:left;padding:7px 9px;border:1px solid #e2ddce;">Finalit\u00e9</th>
      <th style="text-align:left;padding:7px 9px;border:1px solid #e2ddce;">Base l\u00e9gale</th>
      <th style="text-align:left;padding:7px 9px;border:1px solid #e2ddce;">Cat\u00e9gories de donn\u00e9es</th>
    </tr></thead>
    <tbody>${purposeRows.map(r => `<tr><td style="padding:7px 9px;border:1px solid #e2ddce;">${r[0]}</td><td style="padding:7px 9px;border:1px solid #e2ddce;">${r[1]}</td><td style="padding:7px 9px;border:1px solid #e2ddce;">${r[2]}</td></tr>`).join('')}</tbody>
  </table>`;

  const paymentBlock = checked('cPayment') ? `
  <h3>__N__. Paiements en ligne</h3>
  <p>Les paiements effectu\u00e9s sur le site sont trait\u00e9s par des prestataires de paiement tiers${payProviders.length ? " : " + payProviders.map(p => p.url ? `<a href="${p.url}" target="_blank" rel="noopener">${p.name}</a>` : p.name).join(", ") : ""}. Ces prestataires agissent en qualit\u00e9 de responsables de traitement distincts pour les op\u00e9rations de paiement et respectent les normes de s\u00e9curit\u00e9 du secteur des cartes de paiement (PCI-DSS). ${name} ne collecte ni ne conserve vos num\u00e9ros de carte bancaire ou coordonn\u00e9es de compte : ces informations sont transmises directement au prestataire, dont l'usage de vos donn\u00e9es est r\u00e9gi par sa propre politique de confidentialit\u00e9.</p>
  ` : '';

  const cookiesDetail = checked('cCookies') || checked('cThirdParty') ? `
  <p>Le site utilise plusieurs cat\u00e9gories de cookies :</p>
  <ul>
    <li><strong>Cookies essentiels</strong> : n\u00e9cessaires au fonctionnement du site, ils ne peuvent \u00eatre d\u00e9sactiv\u00e9s.</li>
    <li><strong>Cookies de mesure d'audience</strong> : pour comprendre l'utilisation du site et l'am\u00e9liorer (ex. Google Analytics).</li>
    ${checked('cThirdParty') ? "<li><strong>Cookies marketing / tiers</strong> : d\u00e9pos\u00e9s par des outils tiers (ex. Meta Pixel) pour la publicit\u00e9 et le suivi.</li>" : ""}
  </ul>
  <p>Lors de votre premi\u00e8re visite, vous pouvez accepter ou refuser les cookies non essentiels. Vous pouvez \u00e0 tout moment modifier vos pr\u00e9f\u00e9rences ou supprimer les cookies via les param\u00e8tres de votre navigateur.</p>
  ` : `<p>Le site n'utilise que des cookies strictement n\u00e9cessaires \u00e0 son fonctionnement technique.</p>`;

  const transferBlock = usesForeignTools ? `
  <h3>__N__. Transferts de donn\u00e9es hors du pays</h3>
  <p>Certains de nos prestataires techniques (h\u00e9bergement, mesure d'audience, messagerie, paiement) peuvent stocker ou traiter des donn\u00e9es en dehors ${c==='ci' ? "de la C\u00f4te d'Ivoire" : "du B\u00e9nin"}. Dans ce cas, nous nous assurons que des garanties appropri\u00e9es sont mises en place pour assurer un niveau de protection ad\u00e9quat de vos donn\u00e9es, conform\u00e9ment \u00e0 ${lawLabel}.</p>
  ` : '';

  // assemble sections then number them automatically
  let sections = [];
  sections.push(`<h3>__N__. Objet</h3>
  <p>${name} accorde une grande importance \u00e0 la protection de vos donn\u00e9es personnelles. La pr\u00e9sente politique d\u00e9crit comment vos donn\u00e9es sont collect\u00e9es, utilis\u00e9es et prot\u00e9g\u00e9es, conform\u00e9ment \u00e0 ${lawLabel}.</p>`);

  sections.push(`<h3>__N__. Principes du traitement</h3>
  <p>Le traitement de vos donn\u00e9es par ${name} respecte les principes de l\u00e9gitimit\u00e9 et de loyaut\u00e9, de finalit\u00e9 d\u00e9termin\u00e9e et explicite, de proportionnalit\u00e9 (seules les donn\u00e9es n\u00e9cessaires sont collect\u00e9es), de s\u00e9curit\u00e9 et de confidentialit\u00e9, et de transparence envers les personnes concern\u00e9es.</p>`);

  sections.push(`<h3>__N__. Responsable du traitement</h3>
  <p>Le responsable du traitement des donn\u00e9es collect\u00e9es sur ce site est <strong>${responsable}</strong>, joignable \u00e0 l'adresse ${email}${phone ? " ou au " + phone : ""}.</p>`);

  sections.push(`<h3>__N__. Donn\u00e9es collect\u00e9es</h3>
  <p>Dans le cadre de l'utilisation du site, nous collectons :</p>
  <ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`);

  sections.push(`<h3>__N__. Finalit\u00e9s et base l\u00e9gale du traitement</h3>
  <p>Le tableau ci-dessous r\u00e9capitule pourquoi nous traitons vos donn\u00e9es et sur quelle base l\u00e9gale :</p>
  ${purposeTable}`);

  sections.push(`<h3>__N__. Destinataires et sous-traitants</h3>
  <p>Vos donn\u00e9es sont destin\u00e9es au personnel habilit\u00e9 de ${name}, ainsi qu'aux prestataires techniques suivants, strictement n\u00e9cessaires au fonctionnement du site :</p>
  <ul>${processors.map(i => `<li>${i}</li>`).join('')}</ul>
  <p>Elles ne sont ni vendues ni c\u00e9d\u00e9es \u00e0 des tiers \u00e0 des fins commerciales.</p>`);

  if(paymentBlock) sections.push(paymentBlock);
  if(transferBlock) sections.push(transferBlock);

  sections.push(`<h3>__N__. Dur\u00e9e de conservation</h3>
  <p>Vos donn\u00e9es sont conserv\u00e9es pour une dur\u00e9e de ${retention.toLowerCase()}, sauf obligation l\u00e9gale de conservation plus longue.</p>`);

  sections.push(`<h3>__N__. S\u00e9curit\u00e9</h3>
  <p>${name} met en \u0153uvre des mesures techniques et organisationnelles raisonnables pour prot\u00e9ger vos donn\u00e9es contre tout acc\u00e8s non autoris\u00e9, perte ou divulgation.</p>`);

  sections.push(`<h3>__N__. Violation de donn\u00e9es \u00e0 caract\u00e8re personnel</h3>
  <p>${breachLine}</p>`);

  sections.push(`<h3>__N__. Donn\u00e9es des mineurs</h3>
  <p>Ce site n'est pas destin\u00e9 aux personnes mineures. ${name} ne collecte pas sciemment de donn\u00e9es concernant des mineurs sans le consentement de leur repr\u00e9sentant l\u00e9gal. Si vous pensez qu'un mineur nous a transmis des donn\u00e9es sans ce consentement, contactez-nous afin que nous proc\u00e9dions \u00e0 leur suppression.</p>`);

  sections.push(`<h3>__N__. Liens vers des sites tiers</h3>
  <p>Le site peut contenir des liens vers des sites tiers (r\u00e9seaux sociaux, partenaires, prestataires). ${name} ne contr\u00f4le pas le contenu ni les pratiques de confidentialit\u00e9 de ces sites et d\u00e9cline toute responsabilit\u00e9 \u00e0 leur \u00e9gard. Nous vous invitons \u00e0 consulter leurs propres politiques de confidentialit\u00e9.</p>`);

  sections.push(`<h3>__N__. Vos droits</h3>
  <p>Conform\u00e9ment \u00e0 ${lawLabel}, vous disposez des droits suivants concernant vos donn\u00e9es personnelles :</p>
  <ul>${rightsList.map(i => `<li>${i}</li>`).join('')}</ul>
  <p>${exerciseRights}</p>`);

  sections.push(`<h3>__N__. Cookies et traceurs</h3>
  ${cookiesDetail}`);

  sections.push(`<h3>__N__. R\u00e9clamations et autorit\u00e9 de contr\u00f4le</h3>
  <p>${declLine} ${complaintLine} Nous vous invitons \u00e0 nous contacter en premier lieu \u00e0 ${email} afin de tenter de r\u00e9soudre toute r\u00e9clamation \u00e0 l'amiable.</p>`);

  sections.push(`<h3>__N__. Modification de la pr\u00e9sente politique</h3>
  <p>Cette politique peut \u00eatre mise \u00e0 jour \u00e0 tout moment en fonction de l'\u00e9volution l\u00e9gale ou technique. La date de derni\u00e8re mise \u00e0 jour figure en bas de ce document. Nous vous invitons \u00e0 la consulter r\u00e9guli\u00e8rement.</p>`);

  sections.push(`<h3>__N__. Nous contacter</h3>
  <p>Pour toute question relative \u00e0 la pr\u00e9sente politique ou \u00e0 vos donn\u00e9es personnelles, contactez ${responsable} :<br>
  Email : ${email}${phone ? "<br>T\u00e9l\u00e9phone : " + phone : ""}${address ? "<br>Adresse : " + address : ""}</p>`);

  let n = 0;
  let body = sections.join("\n\n").replace(/__N__/g, () => { n += 1; return String(n); });

  return `
  <h2>Politique de confidentialit\u00e9</h2>
  <div class="lawref">${c==='ci' ? "C\u00f4te d'Ivoire \u2014 Loi n\u00b02013-450 du 19 juin 2013 \u2014 ARTCI" : "B\u00e9nin \u2014 Loi n\u00b02017-20 portant Code du num\u00e9rique \u2014 APDP"}</div>
  ${body}
  <p style="font-size:12px;color:#8a887e;margin-top:20px;">Derni\u00e8re mise \u00e0 jour : ${new Date().toLocaleDateString('fr-FR')}</p>
  `;
}

function copyDoc(){
  const text = document.getElementById('docBody').innerText;
  navigator.clipboard.writeText(text).then(()=>{
    const btn = event.target;
    const old = btn.textContent;
    btn.textContent = "Copié !";
    setTimeout(()=>btn.textContent = old, 1500);
  });
}

function triggerDownload(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadHTML(titleText, filenameBase){
  const content = document.getElementById('docBody').innerHTML;
  const full = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${titleText} — ${val('siteName')}</title>
  <style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;padding:0 20px;line-height:1.7;color:#222;}h2{font-size:24px;}h3{font-size:17px;margin-top:26px;}</style>
  </head><body>${content}</body></html>`;
  const blob = new Blob([full], {type:'text/html'});
  triggerDownload(blob, filenameBase + '.html');
}

function downloadWord(titleText, filenameBase){
  const content = document.getElementById('docBody').innerHTML;
  const full = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
  <head><meta charset="UTF-8"><title>${titleText}</title></head>
  <body style="font-family:Calibri, sans-serif;">${content}</body></html>`;
  const blob = new Blob(['\ufeff', full], {type:'application/msword'});
  triggerDownload(blob, filenameBase + '.doc');
}
