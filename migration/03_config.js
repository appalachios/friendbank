const { MongoClient, ObjectId } = require('mongodb');

const {
  MONGODB_URL,
} = process.env;

const { USER_ROLE } = require('../src/shared/roles');
const { ENGLISH, SPANISH } = require('../src/shared/lang');

(async function() {
  const client = await MongoClient.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  db = client.db();

  const usersCollection = db.collection('users');
  const users = await usersCollection.find().toArray();

  console.log('updating users');

  for (const user of users) {
    const userUpdate = {
      '$set': {
        role: USER_ROLE,
      },
    };

    await usersCollection.updateOne({ _id: user._id }, userUpdate);
  }

  const defaultMediaObjects = [
    {
      _id: 'default',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/em-header-original.jpg',
      alt: 'Ed at the Podium',
    },
    {
      _id: 'hoops',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/hoops.jpg',
      alt: 'Ed shooting hoops',
    },
    {
      _id: 'air-flight-89',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/air-flight-89.png',
      alt: 'Ed wearing his pair of Air Flight ‘89s',
    },
    {
      _id: 'ed-clapping',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/Ed+Clap.jpg',
      alt: 'Ed clapping at an event',
    },
    {
      _id: 'ed-climate-march',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/Taylor+St.+Germain+-+P2+Markey+(52+of+70).jpg',
      alt: 'Ed at a climate march with young students',
    },
    {
      _id: 'ed-serving',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/Ed+Serving.JPG',
      alt: 'Ed serving food',
    },
    {
      _id: 'ed-seiu',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/Taylor+St.+Germain+-+32BJ8.jpg',
      alt: 'Ed standing with SEIU supporters',
    },
    {
      _id: 'ed-laughing',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/IMG_3417.JPG',
      alt: 'Ed laughing',
    },
    {
      _id: 'ed-ew-supporters',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/IMG_7718.JPG',
      alt: 'Ed standing with supporters'
    },
    {
      _id: 'ed-unite-here',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/IMG_3743.JPG',
      alt: 'Ed marching with a labor union',
    },
  ];

  console.log('adding default media');

  const media = db.collection('media');
  await media.insertMany(defaultMediaObjects);

  const config = JSON.stringify({
    disableNavDonate: true,
    media: defaultMediaObjects.map((object) => object._id),
    defaultMedia: {
      _id: 'ed-climate-march',
      type: 'image',
      source: 'https://ed-markey-supporter-photos.s3.amazonaws.com/Taylor+St.+Germain+-+P2+Markey+(52+of+70).jpg',
      alt: 'Ed at a climate march with young students',
    },
  });

  const copy = JSON.stringify({
    'idQuestions.support.label': {
      [ENGLISH]: 'Will you vote to elect Marquita Bradshaw to the United States Senate on November 3rd?',
      [SPANISH]: '¿Votará para elegir a Marquita Bradshaw al Senado de los Estados Unidos el 3 de noviembre?',
    },
    'idQuestions.support.options': {
      [ENGLISH]: [
        'Definitely',
        'Probably',
        'Undecided',
        'Probably not',
        'Definitely not',
        'Too Young/Ineligible to Vote',
      ],
      [SPANISH]: [
        'Definitivamente',
        'Probablemente',
        'Indeciso',
        'Probablemente no',
        'Definitivamente no',
        'Demasiado joven/Inelegible para votar',
      ],
    },
    'idQuestions.volunteer.label': {
      [ENGLISH]: 'Will you volunteer with Team Bradshaw?',
      [SPANISH]: '¿Quiéres ser voluntario con el Equipo Bradshaw?',
    },
    'idQuestions.volunteer.options': {
      [ENGLISH]: [
        'Yes',
        'Maybe',
        'Later',
        'No',
      ],
      [SPANISH]: [
        'Sí',
        'Tal vez',
        'Más tarde',
        'No',
      ],
    },
    'homepage.formTitle': {
      [ENGLISH]: 'Create your own Marquita Bradshaw supporter page',
      [SPANISH]: 'Crea tu propia página de apoyo para Marquita Bradshaw',
    },
    'homepage.formSubtitle': {
      [ENGLISH]: 'Our grassroots campaign is powered by people like you who are connecting with family, friends, and neighbors about this important election. Complete the sections below to create your own personal supporter page and reach out to your network about why you’re a member of Team Bradshaw!',
      [SPANISH]: 'Nuestra campaña está impulsada por gente como tú que se está conectando con familia, amigos y vecinos sobre esta elección importante. Completa las siguientes secciones para crear tu propia página de apoyo personal y hablarle a tus redes de por qué eres miembro del Equipo Bradshaw!',
    },
    'homepage.customizeTitle': {
      [ENGLISH]: 'Customize your page',
      [SPANISH]: 'Personaliza tu página',
    },
    'homepage.customizeSubtitle': {
      [ENGLISH]: `Fill out the sections below to personalize the title, description, and design of your supporter page to tell your network why you’re voting #Bradshaw2020. Share your story of why you’re a member of this movement -- feel free to get creative!`,
      [SPANISH]: `Llena las siguientes secciones para personalizar el título, la descripción y el diseño de tu página de apoyo para decirle a tus redes por qué estás votando por #Bradshaw2020. Comparte tu historia de por qué eres miembro de este movimiento. ¡Siéntete libre de ser creativo!`,
    },
    'homepage.formButtonLabel': {
      [ENGLISH]: 'next',
      [SPANISH]: 'siguiente',
    },
    'homepage.createButtonLabel': {
      [ENGLISH]: 'create page',
      [SPANISH]: 'crear página',
    },
    'homepage.defaultTitle': {
      [ENGLISH]: `{{FIRST_NAME}} is voting for #Bradshaw2020 because...`,
      [SPANISH]: '{{FIRST_NAME}} está votando por #Bradshaw2020 porque...'
    },
    'homepage.defaultSubtitle': {
      [ENGLISH]: 'Marquita is a lifelong Tennessean, a working-class woman, and a single mom. She is fighting to support and protect the hardworking people of this state. Let me know that you are with me, and help me reach my goal!',
      [SPANISH]: 'Marquita ha vivido en Tennessee desde su nacimiento y es una mujer de clase trabajadora y madre soltera. Ella está luchando para apoyar y proteger a la gente trabajadora de este estado. ¡Háganme saber que están conmigo y ayúdenme a alcanzar mi meta!',
    },
    'signupPage.postSignupSubtitle': {
      [ENGLISH]: 'Next, keep up the momentum by sharing this link with your friends, family, and network, and help {{FIRST_NAME}} reach their goal! Or, make your own page and get everyone you know to join the fight.',
      [SPANISH]: '¡Mantén el impulso compartiendo este enlace con tus amigos, familia y redes y ayuda a {{FIRST_NAME}} alcanzar su objetivo! O haz tu propia página y haz que todo el que conoces se una a la lucha.',
    },
    'signupPage.postSignupCreateTitle': {
      [ENGLISH]: 'Make your own page',
      [SPANISH]: 'Haz tu propia página',
    },
    'signupPage.postSignupCreateSubtitle': {
      [ENGLISH]: 'Create your own supporter page and become a grassroots organizer for Marquita. We’ll show you how!',
      [SPANISH]: 'Crea tu propia página de apoyo y conviértete en un organizador en tu comunidad para Marquita. ¡Te mostraremos cómo!',
    },
    'signupPage.postSignupCreateButtonLabel': {
      [ENGLISH]: 'Get started',
      [SPANISH]: 'Comenzar',
    },
    'signupPage.modalTitle': {
      [ENGLISH]: `Here's how you can join Marquita Bradshaw's fight`,
      [SPANISH]: 'Como puedes unirte a la lucha de Marquita Bradshaw',
    },
    'signupPage.modalCopy': {
      [ENGLISH]: [
        `### Send your link far and wide`,
        `Share this page with your network to help us grow Team Bradshaw! Your friends, family, neighbors, colleagues, roommates, classmates, Facebook friends, Twitter peeps, your Zoom hangout friends -- the sky's the limit, and we need to reach everyone.`,
        `### Relational organizing tips`,
        ` - Call 5 friends and ask them to fill out your link`,
        ` - Email your link to 50 people`,
        ` - Share it on your Facebook and other social media`,
        ` - Go through your contact list in your phone and text the link to at least 10 people!`,
        ' ',
        `### Volunteer with Team Bradshaw`,
        `[Join the movement here](https://www.marquitabradshaw.com/get-involved).`,
      ],
      [SPANISH]: [
        '### Comparte tu enlace',
        `¡Comparte esta página con tus redes para ayudarnos a crecer el Equipo Bradshaw! Tus amigos, familia, vecinos, colegas, compañeros de habitación, compañeros de clase, amigos de Facebook, seguidores en Twitter, tus amigos de Zoom...el cielo es el límite y tenemos que llegar a todos.`,
        `### Consejos para organizar relacionalmente`,
        ` - Llama a 5 amigos y pídeles que llenen tu enlace`,
        ` - Envía tu enlace a 50 personas`,
        ` - Compártelo en tu Facebook y otras redes sociales`,
        ` - ¡Revisa la lista de contactos de tu teléfono y envía el enlace al menos a 10 personas!`,
        ` `,
        `### Ser voluntario con el Equipo Bradshaw`,
        `[Únete al movimiento aquí](https://www.marquitabradshaw.com/get-involved).`,
      ],
    },
    'signupPage.modalCloseLabel': {
      [ENGLISH]: 'Okay, got it',
      [SPANISH]: 'Perfecto, lo tengo.',
    },
    'nav.logoAlt': {
      [ENGLISH]: 'Marquita Bradshaw For Senate Logo',
      [SPANISH]: 'Logo de Marquita Bradshaw para el Senado',
    },
    'nav.return': {
      [ENGLISH]: '← return to marquitabradshaw.com',
      [SPANISH]: '← volver a marquitabradshaw.com',
    },
    'nav.returnLink': {
      [ENGLISH]: 'https://www.marquitabradshaw.com/',
      [SPANISH]: 'https://www.marquitabradshaw.com/',
    },
    'nav.donateForm': {
      [ENGLISH]: 'https://secure.actblue.com/donate/ejm2020',
    },
    'phonebankPage.title': {
      [ENGLISH]: 'Add a Contact',
      [SPANISH]: 'Añadir un contacto',
    },
    'phonebankPage.subtitle': {
      [ENGLISH]: 'Enter your friends, family, and people in your network. Grow your list of the people you’re personally bringing to this grassroots movement, let Marquita know if they support her, and help make sure this campaign reaches its goals.',
      [SPANISH]: 'Añade a tus amigos, familiares y personas de tu red. Crece tu lista de personas que personalmente trajiste a este movimiento impulsado por el pueblo, déjale saber a Marquita si la apoyan y ayuda a la campaña a alcanzar sus metas.',
    },
    'privacyPolicy.label': {
      [ENGLISH]: 'Privacy Policy',
      [SPANISH]: 'Política de privacidad',
    },
    'privacyPolicy.link': {
      [ENGLISH]: 'https://www.edmarkey.com/privacy-policy/',
      [SPANISH]: 'https://www.edmarkey.com/es/privacy-policy/',
    },
    'politicalDiclaimer': {
      [ENGLISH]: 'PAID FOR BY MARQUITA BRADSHAW FOR US SENATE',
      [SPANISH]: 'PAGADO POR MARQUITA BRADSHAW FOR US SENATE',
    },
    'smsDisclaimer': {
      [ENGLISH]: 'By providing your cell phone number you consent to receive periodic campaign updates from the Bradshaw Campaign.',
      [SPANISH]: 'Al proporcionar su número de teléfono celular usted consiente en recibir actualizaciones periódicas de la campaña de Marquita Bradshaw.',
    },
    'genericError': {
      [ENGLISH]: 'Looks like we had an error, try again? If this continues to happen, please [contact us](mailto:info@marquitabradshaw.com)',
      [SPANISH]: 'Parece que tuvimos un error, ¿intentar de nuevo? Si esto continúa sucediendo, por favor [contáctenos](mailto:info@marquitabradshaw.com)',
    },
  });

  console.log('updating campaign');

  const campaigns = db.collection('campaigns');
  await campaigns.updateOne(
    { domains: 'support.marquitabradshaw.com' },
    {
      '$set': {
        copy,
        config,
      },
    },
  );
})();
