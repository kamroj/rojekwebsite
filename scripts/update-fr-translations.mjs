import fs from 'node:fs'

const filePath = 'public/locales/fr/translation.json'
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))

const set = (path, value) => {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let ref = data
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i]
    if (!(key in ref)) ref[key] = {}
    ref = ref[key]
  }
  ref[parts[parts.length - 1]] = value
}

set('nav.articles', 'Actualités')
set('pageTitle.contact', 'Contact')

set('hsConfigurator.loading', 'Chargement du configurateur…')
set('hsConfigurator.title', 'Configurateur HS')
set('hsConfigurator.header', 'Configurateur HS')
set('hsConfigurator.subtitle', 'Créez votre baie coulissante idéale')
set('hsConfigurator.sections.elements', 'Éléments')
set('hsConfigurator.sections.dimensions', 'Dimensions')
set('hsConfigurator.sections.preview', 'APERÇU')
set('hsConfigurator.labels.frameMaterial', 'Matériau du cadre :')
set('hsConfigurator.labels.handleColor', 'Couleur de la poignée :')
set('hsConfigurator.labels.type', 'Type :')
set('hsConfigurator.labels.thresholdColor', 'Couleur du seuil :')
set('hsConfigurator.labels.width', 'Largeur de la fenêtre :')
set('hsConfigurator.labels.height', 'Hauteur de la fenêtre :')
set('hsConfigurator.warnings.animationOnlyDefault', "L'animation est disponible uniquement pour les dimensions par défaut")
set('hsConfigurator.options.textures.natur', 'Naturel')
set('hsConfigurator.options.textures.honeyPine', 'Pin miel')
set('hsConfigurator.options.handleTextures.silver', 'Argent')
set('hsConfigurator.options.handleTextures.gold', 'Or')
set('hsConfigurator.options.thresholds.silver', 'Argent')
set('hsConfigurator.options.thresholds.black', 'Noir')
set('hsConfigurator.options.thresholds.gold', 'Or')

set('buttons.details', 'Voir les détails')
set('buttons.backToHome', 'Retour au menu principal')
set('buttons.backToMainMenu', 'Retour au menu principal')
set('buttons.backToProducts', 'Retour aux produits')
set('buttons.contact', 'Nous contacter')
set('buttons.viewMore', 'Voir plus')
set('buttons.close', 'Fermer')
set('buttons.pause', 'Pause')
set('buttons.play', 'Lecture')
set('buttons.see', 'Voir')
set('hsConfigurator.buttons.resetDimensions', 'RÉINITIALISER LES DIMENSIONS')
set('hsConfigurator.buttons.open', 'OUVRIR')
set('hsConfigurator.buttons.close', 'FERMER')

set('products.windows.benefits', [
  'Bois naturel de la plus haute qualité',
  'Écologiques et sains pour les habitants',
  'Design et esthétique uniques',
  'Large palette de couleurs et de finitions',
  'Très longue durée de vie et grande solidité',
  "Excellents paramètres d'isolation thermique et acoustique",
])

set('products.woodAlu', {
  name: 'FENÊTRES BOIS-ALUMINIUM',
  description:
    "Les fenêtres bois-aluminium associent la chaleur naturelle du bois à l’intérieur à une protection extérieure en aluminium, durable et résistante aux intempéries.",
  benefits: [
    'Intérieur en bois, extérieur en aluminium',
    'Grande durabilité et faible entretien',
    'Excellente isolation thermique et acoustique',
    'Large choix de finitions et de couleurs extérieures',
    'Adaptées aux projets modernes et classiques',
    'Protection aluminium résistante aux UV et aux intempéries',
  ],
})

set('products.exteriorDoors.description',
  "Les portes d’entrée sont la carte de visite de la maison. Nos portes combinent sécurité, esthétique raffinée et excellente isolation thermique.")
set('products.exteriorDoors.benefits', [
  'Construction robuste garantissant la sécurité',
  'Isolation thermique et acoustique élevée',
  'Résistance aux intempéries et aux déformations',
  'Large choix de modèles, du classique au moderne',
  "Possibilité d’intégrer des systèmes de contrôle d’accès modernes",
  'Personnalisation des dimensions et des accessoires',
])

set('products.fireDoors.description',
  "Les portes coupe-feu assurent la résistance au feu et la protection exigées par les normes de sécurité, tout en offrant une construction solide et certifiée.")
set('products.fireDoors.benefits', [
  'Classes de résistance au feu certifiées',
  'Sécurité incendie renforcée du bâtiment',
  'Construction robuste et résistante au feu',
  'Options d’amélioration anti-effraction',
  'Conserve les performances d’isolation en conditions extrêmes',
  'Adaptation aux exigences du projet et de la réglementation',
])

set('products.interiorDoors.description',
  "Les portes intérieures sont un élément d’aménagement qui associe fonctionnalité et élégance. Elles complètent parfaitement chaque style d’intérieur.")
set('products.interiorDoors.benefits', [
  'Design élégant harmonisé avec la décoration intérieure',
  'Nombreuses possibilités de personnalisation',
  'Excellente isolation acoustique entre les pièces',
  'Construction durable à partir de matériaux de qualité',
  'Fabrication précise pour un fonctionnement fluide',
  'Large choix de quincaillerie et d’accessoires',
])

set('products.sliding.benefits', [
  'Apport maximal de lumière grâce aux grandes surfaces vitrées',
  'Gain de place par rapport aux portes de balcon classiques',
  'Utilisation simple et confortable, même pour de grands ouvrants',
  'Design moderne et vues panoramiques',
  'Excellente étanchéité et isolation thermique',
  'Disponible en version à seuil bas pour plus de confort',
])

set('products.psk.benefits', [
  'Fonctions oscillo-coulissantes dans un seul système',
  'Utilisation confortable et aération sécurisée',
  'Bonnes performances thermiques',
  'Adapté aux ouvrants de grandes dimensions',
  'Finition esthétique et adaptation à la façade',
  'Option de seuil bas pour un meilleur accès',
])

set('productDetail.downloadCatalogPdf', 'Télécharger le catalogue PDF')
set('productDetail.windows.featuresTitle', 'Qu’est-ce qui distingue la fenêtre {{product}} ?')
set('productDetail.windows.colorsMostPopular', 'Couleurs les plus populaires')
set('productDetail.windows.advantagesTitle', 'Pourquoi choisir {{product}} ?')
set('productDetail.windows.warranty.title', 'Une qualité fiable pendant des années')
set('productDetail.windows.warranty.highlight', 'Service de garantie gratuit')
set('productDetail.windows.cta.title', 'Intéressé par les fenêtres {{product}} ?')
set('productDetail.windows.cta.description', 'Nos experts vous aideront à choisir la solution idéale pour votre maison. Contactez-nous pour un devis gratuit.')
set('productDetail.windows.cta.note', 'Nous répondons sous 24 heures')

set('productDetail.doors.featuresTitle', 'Qu’est-ce qui distingue la porte {{product}} ?')
set('productDetail.doors.colorsMostPopular', 'Couleurs les plus populaires')
set('productDetail.doors.advantagesTitle', 'Pourquoi choisir {{product}} ?')
set('productDetail.doors.warranty.title', 'Une qualité fiable pendant des années')
set('productDetail.doors.warranty.highlight', 'Service de garantie gratuit')
set('productDetail.doors.cta.title', 'Intéressé par les portes {{product}} ?')
set('productDetail.doors.cta.description', 'Nos experts vous aideront à choisir la solution idéale pour votre maison. Contactez-nous pour un devis gratuit.')
set('productDetail.doors.cta.note', 'Nous répondons sous 24 heures')
set('productDetail.doors.sections.lock.kicker', 'Sécurité')
set('productDetail.doors.sections.lock.title', 'Serrure 3 points en standard')
set('productDetail.doors.sections.lock.description', 'La sécurité commence par une fermeture fiable. Une serrure 3 points sécurise l’ouvrant à plusieurs endroits, améliorant la résistance à l’effraction et la compression des joints.')
set('productDetail.doors.sections.lock.b1', 'Verrouillage 3 points')
set('productDetail.doors.sections.lock.b2', 'Meilleure pression et étanchéité')
set('productDetail.doors.sections.lock.b3', 'Résistance accrue à l’effraction')
set('productDetail.doors.sections.threshold.kicker', 'Confort')
set('productDetail.doors.sections.threshold.title', 'Seuil bas en aluminium')
set('productDetail.doors.sections.threshold.description', 'Un seuil bas améliore le confort au quotidien : passage facilité, meilleure accessibilité et meilleure évacuation de l’eau.')
set('productDetail.doors.sections.threshold.b1', 'Passage et accessibilité facilités')
set('productDetail.doors.sections.threshold.b2', 'Matériau durable et résistant aux intempéries')
set('productDetail.doors.sections.threshold.b3', 'Favorise l’évacuation de l’eau')
set('productDetail.faq.title', '<product>{{product}}</product> – Questions fréquentes')
set('productDetail.faq.subtitle', 'Retrouvez les réponses aux questions les plus importantes sur notre produit')
set('productDetail.errors.productNotFoundTitle', 'Produit introuvable')
set('productDetail.errors.productNotFoundText', 'Le produit sélectionné n’existe pas.')
set('productDetail.errors.backToCategory', 'Retour à la catégorie')
set('productDetail.errors.noTemplateTitle', 'Aucun modèle de produit')
set('productDetail.errors.noTemplateText', 'Nous n’avons pas encore préparé de page de détail pour cette catégorie.')
set('productDetail.hsOverview.overline', 'Éléments clés')
set('productDetail.hsOverview.subtitle', 'Configuration adaptée à votre projet')
set('productDetail.hsSchemes.sectionTitle', 'Schémas / configurations')
set('productDetail.hsSchemes.selectorAriaLabel', 'Sélection du schéma HS')
set('productDetail.hsSchemes.configurationLabel', 'Configuration :')
set('productDetail.hsSchemes.usageLabel', 'Application :')
set('productDetail.hsSchemes.cta', 'Ouvrir le configurateur HS')
set('productDetail.hsSchemes.items.A.buttonLabel', 'Schéma A')
set('productDetail.hsSchemes.items.A.title', '2 parties (1 vantail fixe + 1 vantail coulissant)')
set('productDetail.hsSchemes.items.A.description', 'La configuration la plus simple et la plus choisie. Un vantail est fixe, l’autre coulisse en parallèle.')
set('productDetail.hsSchemes.items.A.usage', 'Accès à la terrasse, au balcon ou au jardin pour des largeurs standards.')
set('productDetail.hsSchemes.items.A3.buttonLabel', 'Schéma A3')
set('productDetail.hsSchemes.items.A3.title', '2 parties (1 vantail fixe + 1 vantail coulissant – version miroir)')
set('productDetail.hsSchemes.items.A3.description', 'Disposition équivalente au schéma A, avec coulissement dans le sens opposé.')
set('productDetail.hsSchemes.items.A3.usage', 'Lorsque l’ouverture à gauche est requise ou selon la disposition intérieure.')
set('productDetail.hsSchemes.items.C.buttonLabel', 'Schéma C')
set('productDetail.hsSchemes.items.C.title', '4 parties (2 vantaux coulissants + 2 fixes)')
set('productDetail.hsSchemes.items.C.description', 'Deux vantaux coulissants permettent une grande ouverture; les fixes stabilisent la structure.')
set('productDetail.hsSchemes.items.C.usage', 'Grandes baies de terrasse dans des maisons modernes.')
set('productDetail.hsSchemes.items.D.buttonLabel', 'Schéma D')
set('productDetail.hsSchemes.items.D.title', '2 parties (2 vantaux coulissants)')
set('productDetail.hsSchemes.items.D.description', 'Les deux vantaux sont mobiles et coulissent dans des directions opposées.')
set('productDetail.hsSchemes.items.D.usage', 'Pour les terrasses et jardins nécessitant une ouverture bilatérale.')
set('productDetail.hsSchemes.items.E.buttonLabel', 'Schéma E')
set('productDetail.hsSchemes.items.E.title', '3 parties (2 vantaux coulissants + 1 fixe)')
set('productDetail.hsSchemes.items.E.description', 'Combine une large ouverture de passage avec une grande partie vitrée fixe.')
set('productDetail.hsSchemes.items.E.usage', 'Salons modernes avec grandes baies et vue panoramique.')
set('productDetail.hsSchemes.items.F.buttonLabel', 'Schéma F')
set('productDetail.hsSchemes.items.F.title', '4 parties (4 vantaux coulissants)')
set('productDetail.hsSchemes.items.F.description', 'Tous les vantaux sont mobiles et coulissent à gauche et à droite pour une ouverture maximale.')
set('productDetail.hsSchemes.items.F.usage', 'Grandes baies représentatives dans les maisons et résidences modernes.')
set('productDetail.hsSchemes.items.G2.buttonLabel', 'Schéma G2')
set('productDetail.hsSchemes.items.G2.title', '3 parties asymétriques avec montant fixe (1 coulissant + 2 fixes)')
set('productDetail.hsSchemes.items.G2.description', 'Disposition asymétrique avec montant structurel visible.')
set('productDetail.hsSchemes.items.G2.usage', 'Grandes vitrages avec stabilité structurelle renforcée.')
set('productDetail.hsSchemes.items.G3.buttonLabel', 'Schéma G3')
set('productDetail.hsSchemes.items.G3.title', '3 parties asymétriques sans montant fixe (1 coulissant + 2 fixes)')
set('productDetail.hsSchemes.items.G3.description', 'Variante moderne sans montant central visible, pour une surface vitrée plus uniforme.')
set('productDetail.hsSchemes.items.G3.usage', 'Projets architecturaux minimalistes axés sur l’esthétique et la vue.')
set('productDetail.hsSchemes.items.H.buttonLabel', 'Schéma H')
set('productDetail.hsSchemes.items.H.title', '3 parties (3 vantaux coulissants)')
set('productDetail.hsSchemes.items.H.description', 'Tous les vantaux sont mobiles, offrant une ouverture large et flexible.')
set('productDetail.hsSchemes.items.H.usage', 'Grandes baies de terrasse dans les maisons haut de gamme.')
set('productDetail.hsSchemes.items.K.buttonLabel', 'Schéma K')
set('productDetail.hsSchemes.items.K.title', '3 parties (2 vantaux coulissants + 1 fixe central)')
set('productDetail.hsSchemes.items.K.description', 'L’élément fixe est au centre; les vantaux coulissants sont de chaque côté.')
set('productDetail.hsSchemes.items.K.usage', 'Façades larges avec sortie représentative vers terrasse ou jardin.')

set('realizations.subtitle', 'Découvrez nos réalisations')
set('realizations.description', 'Voici une sélection de projets réalisés pour nos clients. Chaque commande est un nouveau défi que nous relevons avec passion et professionnalisme.')
set('realizations.items[0].title', 'Maison individuelle, Wrocław')
set('realizations.items[1].title', 'Ensemble résidentiel moderne, Poznań')
set('realizations.items[2].title', 'Rénovation d’immeuble, Cracovie')
set('realizations.items[3].title', 'Immeuble de bureaux classe A, Varsovie')
set('realizations.items[4].title', 'Lofts dans une ancienne usine, Łódź')
set('realizations.items[5].title', 'Villa en périphérie, Gdańsk')
set('realizations.items[6].title', 'Résidence urbaine, Wrocław')
set('realizations.items[7].title', 'Complexe résidentiel, Gdańsk')

set('presentation.playVideo', 'Lire la vidéo de présentation')

set('cookies.actions.openSettings', 'Paramètres des cookies')
set('cookies.actions.privacyPolicy', 'Politique de confidentialité')
set('cookies.actions.cookiePolicy', 'Politique des cookies')
set('cookies.actions.sitemap', 'Plan du site')
set('cookies.placeholders.map', 'Pour afficher la carte, acceptez les médias externes (Google Maps).')
set('cookies.placeholders.video', 'Pour lire la vidéo, acceptez les médias externes (YouTube).')
set('cookies.placeholders.recaptcha', 'Pour envoyer le formulaire, acceptez le service de sécurité (reCAPTCHA).')

set('tags.categories.door', 'Porte')
set('tags.categories.window', 'Fenêtre')
set('tags.categories.color', 'Couleur')

set('contact.email', 'E-mail')
set('contact.contactTitle', 'Contact')
set('contact.roles.distribution', 'Distribution, marketing et production')

set('errors.404.title', '404 - Page introuvable')
set('errors.404.message', 'Désolé, la page que vous recherchez n’existe pas.')
set('errors.general', 'Une erreur est survenue. Veuillez réessayer.')

set('loading', 'Chargement...')
data['loading.resources'] = 'ressources'
set('navigation.previous', 'Précédent')
set('navigation.next', 'Suivant')
set('navigation.goToSlide', 'Aller à la diapositive')

set('realizationsPage.title', 'Réalisations')
set('realizationsPage.filters.doors', 'Portes')
set('realizationsPage.filters.windows', 'Fenêtres')
set('realizationsPage.filters.color', 'Couleur')
set('realizationsPage.filters.clear', 'Effacer')
set('realizationsPage.filters.apply', 'Appliquer')
set('realizationsPage.filters.filtersTitle', 'Filtres')
set('realizationsPage.filters.close', 'Fermer')
set('realizationsPage.productTypes.interiorDoors', 'Intérieures')
set('realizationsPage.productTypes.exteriorDoors', 'Extérieures')
set('realizationsPage.productTypes.woodWindows', 'Bois')
set('realizationsPage.productTypes.woodAluWindows', 'Bois-alu')

set('language.switcher.label', 'Langue')
set('language.switcher.changeLanguage', 'Changer de langue')

set('history.intro2', 'Notre histoire est celle de la passion, de la détermination et de la recherche constante d’excellence. Chaque étape de notre développement a été pensée pour offrir des produits répondant aux plus hauts standards.')
set('history.item1.title', 'Rénovations historiques')
set('history.item1.text', 'Sous ma direction, nous avons réalisé des centaines de rénovations prestigieuses de bâtiments historiques à Cracovie, en Pologne et en Europe.')
set('history.item2.title', 'Nouvelle ligne de production')
set('history.item2.text', 'Nous avons lancé une ligne moderne de production de fenêtres en bois monobloc. Cela nous a permis de produire des milliers de mètres carrés de menuiseries pour les promoteurs et les clients particuliers.')
set('history.item3.title', 'PRZ Stolarnia')
set('history.item3.text', 'À la suite d’une restructuration, PRZ Stolarnia a été créée comme entreprise indépendante, où je poursuis l’activité avec mes fils.')
set('history.item4.title', 'Fenêtres coulissantes')
set('history.item4.text', 'Nous avons introduit la production de fenêtres coulissantes HS et PSK, équipées de ferrures innovantes et de seuils composites thermiques.')
set('history.item5.title', 'Fenêtres bois-aluminium')
set('history.item5.text', 'Nous avons lancé la production de fenêtres bois-aluminium — la beauté du bois à l’intérieur et une protection durable à l’extérieur.')
set('history.item6.title', 'Projets historiques')
set('history.item6.text', 'Avec nos partenaires en France, nous avons développé et mis en œuvre un modèle de fenêtre inspiré de modèles historiques traditionnels, avec ferrures à l’ancienne type Cremone.')
set('history.item7.title', 'Modèle pour le marché belge')
set('history.item7.text', 'Nous avons enrichi notre offre d’un modèle de fenêtre modifié avec larmier en bois, conçu pour le marché belge.')
set('history.ctaTitle', 'Apprenez à mieux nous connaître')
set('history.ctaText', 'Contactez-nous et découvrez nos produits et services')
set('history.ctaButton', 'Nous contacter')
set('history.headerAlt', 'Histoire de l’entreprise ROJEK')

set('headquarters.description1', 'Notre site de production est situé à Kryspinów 399, à proximité de l’autoroute A4.')
set('headquarters.description2', 'Nous vous invitons dans notre showroom pour découvrir notre gamme complète et bénéficier de conseils experts.')
set('headquarters.imageAlt', 'Siège de l’entreprise ROJEK')

set('management.title', 'Direction')
set('management.members[0].role', 'Propriétaire')
set('management.members[1].role', 'Propriétaire')
set('management.members[2].role', 'Propriétaire')
set('management.members[3].name', 'Anna Nowak')
set('management.members[3].role', 'Responsable de production')

set('contactPage.header.title', 'Informations de contact')
set('contactPage.header.subtitle', 'Vous avez des questions ? Nous sommes là pour vous aider !')
set('contactPage.form.useForm', 'Utilisez notre formulaire')
set('contactPage.form.nameLabel', 'Nom')
set('contactPage.form.namePlaceholder', 'Jean')
set('contactPage.form.emailLabel', 'E-mail')
set('contactPage.form.emailPlaceholder', 'jean.dupont@example.com')
set('contactPage.form.phoneLabel', 'Téléphone')
set('contactPage.form.messageLabel', 'Message')
set('contactPage.form.messagePlaceholder', 'Contenu du message...')
set('contactPage.actions.sending', 'Envoi...')
set('contactPage.actions.send', 'Envoyer')
set('contactPage.success', 'Merci ! Votre message a bien été envoyé.')
set('contactPage.errors.nameRequired', 'Le nom est requis.')
set('contactPage.errors.emailRequired', 'L’adresse e-mail est requise.')
set('contactPage.errors.emailInvalid', 'Veuillez saisir une adresse e-mail valide.')
set('contactPage.errors.messageRequired', 'Le message est requis.')
set('contactPage.errors.recaptchaRequired', 'Veuillez confirmer le reCAPTCHA.')
set('contactPage.errors.sendFailed', 'Échec de l’envoi du message. Veuillez réessayer.')
set('contactPage.direct.header', 'Contactez-nous directement')
set('contactPage.direct.labels.registrationData', 'Données d’enregistrement')
set('contactPage.gdpr.notice', 'Le responsable du traitement de vos données personnelles est ROJEK Okna i Drzwi Sp. z o.o., dont le siège est à Kraków (Kryspinów 399, 32-060 Kryspinów). Les données seront traitées afin de répondre à votre demande et d’assurer la meilleure qualité de service. L’envoi du formulaire vaut consentement volontaire à être contacté par e-mail ou téléphone pour le traitement de la demande. Vous pouvez retirer votre consentement à tout moment en envoyant un message à biuro@rojekoid.pl.')

set('footer.copy', '© {{year}} ROJEK fenêtres et portes. Tous droits réservés.')
set('sections.products', 'PRODUITS')
set('sections.contactInfo', 'CONTACT')
set('products.exteriorDoors.name', 'PORTES D’ENTRÉE')
set('products.fireDoors.name', 'PORTES COUPE-FEU')
set('products.interiorDoors.name', 'PORTES INTÉRIEURES')
set('products.sliding.name', 'FENÊTRES COULISSANTES (HS)')
set('products.sliding.description', 'Les systèmes coulissants HS sont une solution moderne permettant de créer de grandes baies vitrées et une transition fluide vers la terrasse ou le jardin.')
set('products.psk.description', 'Le système PSK est une solution oscillo-coulissante pratique, combinant ventilation et coulissement confortable pour de grandes baies vitrées.')
set('productDetail.windows.colorsTitle', 'COULEURS')
set('productDetail.windows.colorsLazurTab', 'LAZURE')
set('productDetail.windows.colorsFullPalette', 'Palette complète RAL')
set('productDetail.windows.warranty.text', 'Nous sommes convaincus de la qualité de nos produits, c’est pourquoi pendant <strong>5 ans</strong> après la pose vous pouvez signaler tout défaut de la menuiserie. De plus, nous offrons une <strong>garantie de 10 ans</strong> sur l’étanchéité des vitrages avec intercalaire Warmatec.')
set('productDetail.doors.colorsTitle', 'COULEURS')
set('productDetail.doors.colorsLazurTab', 'LAZURE')
set('productDetail.doors.colorsFullPalette', 'Palette complète RAL')
set('productDetail.doors.warranty.text', 'Nous sommes convaincus de la qualité de nos produits, c’est pourquoi pendant <strong>5 ans</strong> après la pose vous pouvez signaler tout défaut de la menuiserie. De plus, nous offrons une <strong>garantie de 10 ans</strong> sur l’étanchéité des vitrages avec intercalaire Warmatec.')
set('productDetail.hsOverview.title', 'Dans le système HS')
set('whyUs.items[2].title', 'Accompagnement')
set('presentation.title', 'Présentation de l’entreprise ROJEK')
set('realizationsPage.productTypes.pvcWindows', 'PVC')
set('breadcrumbs.contact', 'Contact')
set('history.intro1', 'ROJEK est une entreprise familiale avec plus de 40 ans de tradition. Dès le début, nous misons sur la plus haute qualité, une approche individuelle et un développement continu.')
set('management.label', 'DIRECTION')
set('contactPage.form.messageLabel', 'Message')
set('contactPage.direct.values.hours', 'Lun–Ven : 8:00–16:00')

set('productSpecs.labels.profileThickness', 'épaisseur du profilé')
set('productSpecs.labels.thermalTransmittance', 'transmission thermique (Uw)')
set('productSpecs.labels.waterTightness', 'étanchéité à l’eau')
set('productSpecs.labels.lockSystem', 'système de verrouillage')
set('productSpecs.labels.threshold', 'seuil')
set('productSpecs.tooltipAria', 'Explication du paramètre : {{spec}}')
set('productSpecs.tooltips.profileThickness', 'L’épaisseur du profilé (par ex. 70–86 mm) influence la rigidité de la structure et permet l’utilisation de vitrages plus épais.')
set('productSpecs.tooltips.thermalTransmittance', 'La transmission thermique (Uw) indique la quantité de chaleur qui s’échappe par la fenêtre. Plus la valeur est basse, meilleure est l’isolation.')
set('productSpecs.tooltips.waterTightness', 'L’étanchéité à l’eau (par ex. classe 9A) indique la résistance à la pénétration de l’eau sous pluie et vent.')
set('productSpecs.tooltips.lockSystem', 'Une serrure multipoints offre une sécurité nettement supérieure à une serrure standard.')
set('productSpecs.tooltips.threshold', 'Un seuil bas en aluminium améliore l’accessibilité et facilite l’évacuation de l’eau.')

fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
console.log('French translations updated.')