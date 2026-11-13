import type { PhotoKey } from "./photos";
import type { View } from "./geo";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
export const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export type Region = "Cultural Triangle" | "Hill Country" | "South Coast" | "West Coast" | "East Coast" | "The North";
export const REGIONS: Region[] = ["Cultural Triangle", "Hill Country", "South Coast", "West Coast", "East Coast", "The North"];

export type Tag = "Heritage" | "Beach" | "Wildlife" | "Nature" | "City" | "Surf" | "Hiking";
export const TAGS: Tag[] = ["Heritage", "Beach", "Wildlife", "Nature", "Hiking", "Surf", "City"];

export interface Destination {
  slug: string;
  name: string;
  native: string;
  tagline: string;
  region: Region;
  tags: Tag[];
  lat: number;
  lng: number;
  high?: boolean;
  photo: PhotoKey;
  gallery: PhotoKey[];
  unesco?: string;
  summary: string[];
  highlights: { title: string; text: string }[];
  best: number[];
  stay: string;
  getThere: string;
  tips: string[];
  nearby: string[];
}

export const DESTINATIONS: Destination[] = [
  {
    slug: "sigiriya",
    name: "Sigiriya",
    native: "සීගිරිය",
    tagline: "A king's palace on top of a 200-metre rock",
    region: "Cultural Triangle",
    tags: ["Heritage", "Hiking", "Nature"],
    lat: 7.957,
    lng: 80.76,
    photo: "sigiriya",
    gallery: ["sigiriyaFar", "sigiriyaView", "sigiriyaGardens", "sigiriyaMood"],
    unesco: "Ancient City of Sigiriya · inscribed 1982",
    summary: [
      "Sigiriya — Lion Rock — is a column of granite that stands roughly 200 metres above the plains. In the late fifth century King Kashyapa put a palace on its flat summit and wrapped the base in terraces, pools and fountains that still fill when it rains.",
      "The climb takes you past the painted 'Sigiriya maidens', along the polished Mirror Wall scratched with thousand-year-old visitor poetry, and between two enormous stone lion paws before the final staircase to the top.",
    ],
    highlights: [
      { title: "The Lion's Paws", text: "All that remains of a brick lion whose open mouth once formed the gateway to the summit." },
      { title: "Frescoes & Mirror Wall", text: "Fifth-century paintings in a sheltered pocket of the rock, and a wall once polished so the king could see himself pass." },
      { title: "Water gardens", text: "Symmetrical pools, channels and fountains at the foot of the rock — among the oldest landscaped gardens anywhere." },
      { title: "Pidurangala at dawn", text: "The neighbouring rock is a shorter scramble and gives the classic sunrise view back towards Sigiriya." },
    ],
    best: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    stay: "2 days",
    getThere: "Around four hours by road from Colombo or the airport. Dambulla, 30 minutes away, is the nearest bus hub; Habarana has the closest railway station.",
    tips: [
      "Be at the gate when it opens — the rock face is in full sun by mid-morning and there are about 1,200 steps.",
      "Wasps nest on the upper rock; keep your voice down near the warning signs.",
      "The on-site museum is included in the ticket and explains what you are about to climb.",
    ],
    nearby: ["dambulla", "minneriya", "polonnaruwa"],
  },
  {
    slug: "dambulla",
    name: "Dambulla",
    native: "දඹුල්ල",
    tagline: "Five painted caves and more than 150 Buddhas",
    region: "Cultural Triangle",
    tags: ["Heritage"],
    lat: 7.86,
    lng: 80.65,
    photo: "dambulla",
    gallery: ["dambullaSeated"],
    unesco: "Rangiri Dambulla Cave Temple · inscribed 1991",
    summary: [
      "Under a vast overhang of rock, five caves have been a place of worship since the first century BCE, when King Valagamba sheltered here in exile. Later kings filled them with statues and covered every ceiling with murals.",
      "Today there are more than 150 images of the Buddha, the largest a 14-metre reclining figure cut from the living rock. The walk up takes fifteen to twenty minutes and ends with a wide view over the plains to Sigiriya.",
    ],
    highlights: [
      { title: "Cave of the Great Kings", text: "The largest cave: dozens of statues beneath a ceiling painted to look like draped cloth." },
      { title: "The reclining Buddha", text: "Fourteen metres long and carved straight out of the rock in the first cave." },
      { title: "Produce market", text: "Dambulla's wholesale market is where much of the island's fruit and vegetables change hands — loud, colourful, best early." },
    ],
    best: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    stay: "Half a day",
    getThere: "On the main Kandy–Sigiriya road and well served by buses. Most visitors stop on the way between Kandy and Sigiriya.",
    tips: [
      "This is an active temple: cover shoulders and knees, and leave shoes at the counter by the entrance.",
      "The rock is hot underfoot by midday — go early or late and carry socks.",
      "Macaques on the path will take anything edible they can see.",
    ],
    nearby: ["sigiriya", "kandy", "minneriya"],
  },
  {
    slug: "anuradhapura",
    name: "Anuradhapura",
    native: "අනුරාධපුරය",
    tagline: "The first capital and its sacred Bodhi tree",
    region: "Cultural Triangle",
    tags: ["Heritage"],
    lat: 8.34,
    lng: 80.4,
    photo: "ruwanweli",
    gallery: ["ruwanweliTrees", "monks"],
    unesco: "Sacred City of Anuradhapura · inscribed 1982",
    summary: [
      "For well over a thousand years, from the fourth century BCE, Anuradhapura was the island's capital. What survives is a sacred city on a huge scale: brick stupas as tall as cathedrals, monastery ruins, bathing ponds and reservoirs that still water the surrounding rice fields.",
      "At its heart is the Jaya Sri Maha Bodhi, a fig tree grown from a cutting of the tree under which the Buddha attained enlightenment. Planted in 288 BCE, it is the oldest living tree with a recorded planting date, and it has been tended continuously ever since.",
    ],
    highlights: [
      { title: "Jaya Sri Maha Bodhi", text: "Pilgrims in white bring flowers and oil lamps here every day, as they have for more than two thousand years." },
      { title: "Ruwanwelisaya", text: "The great white stupa of King Dutugemunu, ringed by a wall of carved elephants." },
      { title: "Jetavanaramaya", text: "Once about 122 metres high — one of the tallest structures of the ancient world." },
      { title: "Mihintale", text: "The hill 13 km east where, by tradition, Buddhism first reached the island in the third century BCE." },
    ],
    best: [2, 3, 4, 5, 6, 7, 8, 9],
    stay: "1–2 days",
    getThere: "About 4–5 hours from Colombo by road or by train on the northern line. The sites are spread out — hire a bicycle or a tuk-tuk for the day.",
    tips: [
      "Wear white or light colours and clothing that covers shoulders and knees; you will be removing shoes often.",
      "Poya (full-moon) days are busy and moving — and very crowded.",
      "Poson, the June full moon, draws vast numbers of pilgrims to Mihintale.",
    ],
    nearby: ["sigiriya", "jaffna", "trincomalee"],
  },
  {
    slug: "polonnaruwa",
    name: "Polonnaruwa",
    native: "පොළොන්නරුව",
    tagline: "A medieval royal city you explore by bicycle",
    region: "Cultural Triangle",
    tags: ["Heritage", "Nature"],
    lat: 7.94,
    lng: 81.0,
    photo: "polonnaruwa",
    gallery: ["polonnaruwaLion", "polonnaruwaPalace"],
    unesco: "Ancient City of Polonnaruwa · inscribed 1982",
    summary: [
      "Polonnaruwa became the capital in the eleventh century and reached its height under King Parakramabahu I, who built the Parakrama Samudra — a reservoir so large it is called a sea.",
      "The ruins are compact and beautifully preserved: a royal palace with walls three metres thick, a circular relic house, a council chamber with a carved lion throne, and the four serene Buddhas of Gal Vihara cut from a single face of granite.",
    ],
    highlights: [
      { title: "Gal Vihara", text: "Four twelfth-century Buddha figures carved from one long slab of rock — the high point of Sinhalese sculpture." },
      { title: "The Sacred Quadrangle", text: "A cluster of shrines including the circular Vatadage with its moonstones and guard stones." },
      { title: "Royal Palace", text: "The brick shell of what chronicles describe as a seven-storey palace." },
      { title: "Parakrama Samudra", text: "Cycle the bund at sunset when cormorants and fishermen share the water." },
    ],
    best: [2, 3, 4, 5, 6, 7, 8, 9],
    stay: "1 day",
    getThere: "About 1¼ hours east of Sigiriya by road. Bicycles are rented at every guesthouse and are the best way round the site.",
    tips: [
      "Start at the museum by the lake, then ride north through the site so you finish at Gal Vihara.",
      "Carry water — shade is patchy and the dry zone earns its name.",
    ],
    nearby: ["minneriya", "sigiriya", "trincomalee"],
  },
  {
    slug: "minneriya",
    name: "Minneriya & Kaudulla",
    native: "මින්නේරිය",
    tagline: "Where hundreds of elephants gather in the dry season",
    region: "Cultural Triangle",
    tags: ["Wildlife", "Nature"],
    lat: 8.03,
    lng: 80.9,
    photo: "elephants",
    gallery: ["elephantsGreen", "elephantFamily"],
    summary: [
      "When the dry season shrinks the ancient Minneriya reservoir, fresh grass springs up on its exposed bed and elephants walk in from across the region to feed. At its peak in August and September several hundred can be seen at once — an event known simply as The Gathering.",
      "The herds move between Minneriya, neighbouring Kaudulla and the Hurulu forest as water levels change, so local jeep drivers will tell you which park to choose on the day.",
    ],
    highlights: [
      { title: "The Gathering", text: "One of the largest regular congregations of Asian elephants anywhere, peaking in August and September." },
      { title: "A third-century reservoir", text: "The tank at the centre of the park was built by King Mahasen some 1,700 years ago." },
      { title: "Birdlife", text: "Painted storks, pelicans and fish eagles work the shallows while you wait for the herds." },
    ],
    best: [7, 8, 9, 10],
    stay: "An afternoon",
    getThere: "Both parks are 30–45 minutes from Sigiriya or Habarana. Safaris run in open jeeps, usually from mid-afternoon.",
    tips: [
      "Ask your driver to keep a respectful distance and not to cut across a herd's path.",
      "Afternoon safaris have the best light and the largest groups.",
    ],
    nearby: ["sigiriya", "polonnaruwa", "dambulla"],
  },
  {
    slug: "kandy",
    name: "Kandy",
    native: "මහනුවර",
    tagline: "The last royal capital, home of the Sacred Tooth",
    region: "Hill Country",
    tags: ["Heritage", "City", "Nature"],
    lat: 7.29,
    lng: 80.63,
    photo: "kandyTemple",
    gallery: ["kandyLake", "kandyGardens", "kandyHotel", "drummers"],
    unesco: "Sacred City of Kandy · inscribed 1988",
    summary: [
      "Ringed by forested hills around a quiet lake, Kandy held out against European powers for three centuries and remained the capital of the Sinhalese kings until 1815. It is still the island's cultural heart.",
      "The Temple of the Sacred Tooth Relic — Sri Dalada Maligawa — houses a tooth of the Buddha, the most venerated object in the country. Drums and horns announce the daily offerings, and for ten nights each July or August the Esala Perahera fills the streets with dancers, fire and caparisoned elephants.",
    ],
    highlights: [
      { title: "Temple of the Tooth", text: "Join the evening puja, when the inner shrine opens to the sound of drumming." },
      { title: "Kandy Lake", text: "Created by the last king in 1807; an easy, shaded walk around its edge." },
      { title: "Peradeniya Botanic Gardens", text: "Sixty hectares of palms, orchids and giant fig trees in a bend of the Mahaweli river." },
      { title: "Kandyan dance", text: "Nightly performances of drumming, acrobatic dance and fire-walking." },
    ],
    best: [1, 2, 3, 4, 7, 8, 12],
    stay: "2 days",
    getThere: "Three hours from Colombo by road, or about 2½–3 hours on one of the island's prettiest train rides.",
    tips: [
      "Dress modestly for the temple and expect security checks; go for the 6.30pm ceremony.",
      "Book well ahead for Perahera nights — seats and rooms sell out.",
      "This is where the famous hill-country train to Ella begins.",
    ],
    nearby: ["dambulla", "nuwara-eliya", "adams-peak"],
  },
  {
    slug: "nuwara-eliya",
    name: "Nuwara Eliya",
    native: "නුවරඑළිය",
    tagline: "Tea country at 1,868 metres",
    region: "Hill Country",
    tags: ["Nature", "Heritage"],
    lat: 6.95,
    lng: 80.79,
    high: true,
    photo: "teaPicker",
    gallery: ["teaHills", "hillFalls", "teaPot"],
    summary: [
      "The highest town in Sri Lanka sits in a bowl of tea-covered hills where mornings are misty, nights are cold enough for a fire, and the British left behind gabled bungalows, a racecourse and a red-brick post office.",
      "This is the centre of high-grown Ceylon tea. Estates welcome visitors to walk the fields, watch leaf being withered, rolled and fired, and taste the light, floral cup the altitude produces.",
    ],
    highlights: [
      { title: "Tea estates", text: "Tour a working factory, then taste the day's production overlooking the fields." },
      { title: "Gregory Lake & Victoria Park", text: "Colonial-era gardens and a lakeside promenade in the middle of town." },
      { title: "Waterfalls", text: "The roads in and out pass falls such as Ramboda, Devon and St Clair's." },
      { title: "Gateway to Horton Plains", text: "Leave before dawn for World's End, an hour's drive away." },
    ],
    best: [1, 2, 3, 4],
    stay: "1–2 days",
    getThere: "The railway station is Nanu Oya, 8 km from town, on the Kandy–Ella line. By road it is about 2½ hours from Kandy.",
    tips: [
      "Pack a warm layer — night temperatures can fall below 10°C.",
      "April is the local holiday season: lively, crowded and pricier.",
    ],
    nearby: ["horton-plains", "ella", "kandy"],
  },
  {
    slug: "ella",
    name: "Ella",
    native: "ඇල්ල",
    tagline: "Viaducts, valley views and easy hill walks",
    region: "Hill Country",
    tags: ["Nature", "Hiking"],
    lat: 6.87,
    lng: 81.05,
    high: true,
    photo: "nineArchTrain",
    gallery: ["nineArch", "ravanaFalls", "ellaView", "nineArchTea"],
    summary: [
      "A small town strung along a ridge at about 1,000 metres, Ella looks straight down the Ella Gap to the southern plains. People come for a night and stay for a week of short walks, tea-estate cafés and cool evenings.",
      "The railway is the star. The Nine Arch Bridge, finished in 1921, carries the line 24 metres above a tea-filled valley on arches of brick and stone, and the journey here from Kandy is regularly named among the most scenic train rides in the world.",
    ],
    highlights: [
      { title: "Nine Arch Bridge", text: "Walk down through tea bushes and wait for a train to curve across the viaduct." },
      { title: "Little Adam's Peak", text: "An easy 45-minute climb for sunrise over the Ella Gap." },
      { title: "Ella Rock", text: "A half-day hike along the tracks and up through forest to a cliff-edge viewpoint." },
      { title: "Ravana Falls", text: "A broad cascade beside the road a few kilometres below town." },
    ],
    best: [1, 2, 3, 4, 6, 7, 8, 9],
    stay: "2–3 days",
    getThere: "Six to seven hours from Kandy by train — reserve seats ahead or travel unreserved and stand in an open doorway.",
    tips: [
      "Check the timetable at the station for train times over the bridge; they shift.",
      "Stay off the viaduct itself when a train is due and keep clear of the track edge.",
    ],
    nearby: ["nuwara-eliya", "horton-plains", "yala"],
  },
  {
    slug: "horton-plains",
    name: "Horton Plains",
    native: "හෝර්ටන් තැන්න",
    tagline: "Cloud forest and a cliff called World's End",
    region: "Hill Country",
    tags: ["Nature", "Hiking", "Wildlife"],
    lat: 6.8,
    lng: 80.8,
    high: true,
    photo: "horton",
    gallery: ["hortonTrail", "hortonHills"],
    unesco: "Central Highlands of Sri Lanka · inscribed 2010",
    summary: [
      "A windswept plateau more than 2,100 metres up, Horton Plains is unlike anywhere else on the island: tussock grassland, stunted cloud forest hung with lichen, and icy streams that feed three of the country's major rivers.",
      "A nine-kilometre loop leads to World's End, where the plateau stops dead and the ground falls away about 870 metres, and on to Baker's Falls. Sambar deer graze beside the path at dawn.",
    ],
    highlights: [
      { title: "World's End", text: "A sheer escarpment with views, on a clear morning, to the south coast." },
      { title: "Baker's Falls", text: "A wide fan of water in a fern-filled gully halfway round the loop." },
      { title: "Cloud forest", text: "Home to endemic birds and the shy purple-faced langur." },
    ],
    best: [1, 2, 3, 4],
    stay: "A morning",
    getThere: "About an hour by road from Nuwara Eliya. Leave around 5am: mist usually hides the view by mid-morning.",
    tips: [
      "Single-use plastics are removed at the gate — bring a reusable bottle.",
      "It is cold and often wet at dawn; wear layers and proper shoes.",
    ],
    nearby: ["nuwara-eliya", "ella", "adams-peak"],
  },
  {
    slug: "adams-peak",
    name: "Adam's Peak",
    native: "ශ්‍රී පාද",
    tagline: "A night climb to a sacred summit",
    region: "Hill Country",
    tags: ["Hiking", "Heritage", "Nature"],
    lat: 6.81,
    lng: 80.5,
    high: true,
    photo: "sunrisePeaks",
    gallery: ["sunriseValley", "mistFalls"],
    unesco: "Central Highlands of Sri Lanka · inscribed 2010",
    summary: [
      "Sri Pada — the Sacred Footprint — is a 2,243-metre cone that people of four faiths have climbed for more than a thousand years. Buddhists revere the mark at the summit as the Buddha's footprint, Hindus as Shiva's, and Muslim and Christian tradition as Adam's.",
      "In season the path of some 5,000 steps is lit all night and lined with tea stalls. Pilgrims and travellers start around two in the morning to reach the top for sunrise, when the mountain throws a perfect triangular shadow across the clouds.",
    ],
    highlights: [
      { title: "Sunrise from the summit", text: "Bells ring as the sun comes up and the peak's shadow stretches west." },
      { title: "The pilgrim path", text: "Families, monks and grandmothers climbing through the night, sharing tea and encouragement." },
      { title: "Tea-country approach", text: "The road in winds past reservoirs, estates and waterfalls." },
    ],
    best: [12, 1, 2, 3, 4],
    stay: "1 night",
    getThere: "The usual base is Nallathanniya (Dalhousie), reached by road from Hatton station on the Kandy–Ella railway.",
    tips: [
      "The pilgrimage season runs from the December full moon to Vesak in May; outside it the path is dark, wet and largely closed up.",
      "Weekends and Poya days are extremely crowded near the top.",
      "It is cold at the summit before dawn — carry a jacket and something dry to change into.",
    ],
    nearby: ["nuwara-eliya", "kandy", "horton-plains"],
  },
  {
    slug: "colombo",
    name: "Colombo",
    native: "කොළඹ",
    tagline: "Sea breeze, street food and a restless capital",
    region: "West Coast",
    tags: ["City", "Heritage"],
    lat: 6.93,
    lng: 79.9,
    photo: "colombo",
    gallery: ["colomboNight", "colomboBuddhas", "streetFood", "tuktuk"],
    summary: [
      "Most journeys begin in Colombo, and it rewards a day or two: a port city of colonial arcades, glass towers, temples, mosques and markets, with the Indian Ocean on its doorstep.",
      "Spend the afternoon in the lanes of Pettah, visit the lakeside Seema Malaka shrine, then join half the city on Galle Face Green at sunset for kites, cricket and prawn fritters hot from the cart.",
    ],
    highlights: [
      { title: "Galle Face Green", text: "The seafront promenade where Colombo comes to eat, stroll and watch the sun go down." },
      { title: "Pettah & the Red Mosque", text: "A maze of market streets around the candy-striped Jami Ul-Alfar mosque." },
      { title: "Gangaramaya & Seema Malaka", text: "An eclectic temple-museum and its serene meditation hall floating on Beira Lake." },
      { title: "Lotus Tower", text: "A 350-metre lotus bud with an observation deck over the whole city." },
    ],
    best: [12, 1, 2, 3, 4],
    stay: "1–2 days",
    getThere: "Bandaranaike International Airport is about 30 km north; the expressway takes 30–45 minutes outside rush hour.",
    tips: [
      "Use metered tuk-tuks or a ride-hailing app for fair fares.",
      "Many travellers skip the first night here and return for the last — it suits both.",
    ],
    nearby: ["galle", "kandy"],
  },
  {
    slug: "galle",
    name: "Galle",
    native: "ගාල්ල",
    tagline: "A walled sea-fort still lived in after 400 years",
    region: "South Coast",
    tags: ["Heritage", "City", "Beach"],
    lat: 6.06,
    lng: 80.24,
    photo: "galleLighthouse",
    gallery: ["galleWall", "galleClock", "galleCafe", "masks"],
    unesco: "Old Town of Galle and its Fortifications · inscribed 1988",
    summary: [
      "On a rocky headland at the island's south-west corner, the Portuguese founded a fort that the Dutch rebuilt in the seventeenth century into the best-preserved colonial sea fortress in South Asia.",
      "Inside the ramparts is a living town: lanes of shuttered villas, churches and mosques, courtyards turned into cafés and galleries, and a lighthouse standing over a tiny beach. At dusk everyone walks the walls.",
    ],
    highlights: [
      { title: "Rampart walk", text: "Circle the bastions at sunset as boys dive from Flag Rock." },
      { title: "The lighthouse", text: "The island's oldest light station, beside a sheltered swimming cove." },
      { title: "Dutch Reformed Church", text: "Built in 1755, its floor paved with carved gravestones." },
      { title: "Lanes & courtyards", text: "Boutiques, gem dealers and some of the best cafés in the country." },
    ],
    best: [11, 12, 1, 2, 3, 4],
    stay: "2 days",
    getThere: "About two hours from Colombo on the Southern Expressway, or 2½ hours on the coastal railway with the sea beside the window.",
    tips: [
      "The fort is small and best on foot; mornings are quiet and cool.",
      "Unawatuna and its beaches are ten minutes away by tuk-tuk.",
    ],
    nearby: ["weligama", "mirissa", "colombo"],
  },
  {
    slug: "weligama",
    name: "Weligama & Unawatuna",
    native: "වැලිගම",
    tagline: "Beginner waves, palm-shaded coves and stilt fishermen",
    region: "South Coast",
    tags: ["Beach", "Surf"],
    lat: 6.0,
    lng: 80.38,
    photo: "weligama",
    gallery: ["unawatuna", "stiltFisher", "weligamaBeach", "coconut"],
    summary: [
      "Between Galle and Mirissa the coast breaks into a string of bays. Weligama's is the broadest: two kilometres of sand with a gentle, forgiving wave that has made it the place to learn to surf in Sri Lanka.",
      "Closer to Galle, Unawatuna curls around a sheltered lagoon good for swimming, and along the rocks between them fishermen still balance on wooden stilts above the surf.",
    ],
    highlights: [
      { title: "Learn to surf", text: "Dozens of surf schools rent boards by the hour along Weligama beach." },
      { title: "Stilt fishing", text: "A tradition unique to this coast, best seen around Koggala and Ahangama at dawn or dusk." },
      { title: "Jungle Beach", text: "A small cove below the Rumassala headland and its white peace pagoda." },
    ],
    best: [11, 12, 1, 2, 3, 4],
    stay: "2–4 days",
    getThere: "Thirty to forty minutes east of Galle by road; coastal trains and buses stop at both towns.",
    tips: [
      "From May to September the sea here is rough — head for the east coast instead.",
      "Swim where others are swimming; some beaches have strong currents.",
    ],
    nearby: ["galle", "mirissa", "yala"],
  },
  {
    slug: "mirissa",
    name: "Mirissa",
    native: "මිරිස්ස",
    tagline: "A crescent of sand and the blue whales beyond it",
    region: "South Coast",
    tags: ["Beach", "Wildlife"],
    lat: 5.98,
    lng: 80.47,
    photo: "mirissaPalms",
    gallery: ["mirissaBeach", "palmOcean", "whale"],
    summary: [
      "Mirissa is the south coast in miniature: a curve of golden sand, a headland of coconut palms, fishing boats in the harbour and seafood grilled on the beach at night.",
      "It is also one of the best places on earth to see blue whales. The continental shelf drops away close to shore here, and from November to April boats leave at dawn to look for blue and sperm whales and pods of spinner dolphins.",
    ],
    highlights: [
      { title: "Whale watching", text: "Blue whales, the largest animals that have ever lived, feed a few kilometres offshore in season." },
      { title: "Coconut Tree Hill", text: "A red-earth bluff planted with palms — the photograph everyone takes home." },
      { title: "Beach dinners", text: "Choose your fish from the ice and eat with your feet in the sand." },
    ],
    best: [11, 12, 1, 2, 3, 4],
    stay: "2–3 days",
    getThere: "About 45 minutes east of Galle; 2½ hours from Colombo by expressway.",
    tips: [
      "Pick a whale-watching operator that keeps its distance and never chases animals.",
      "The sea can be choppy — take seasickness precautions before you board.",
    ],
    nearby: ["weligama", "galle", "yala"],
  },
  {
    slug: "yala",
    name: "Yala",
    native: "යාල",
    tagline: "Leopard country on the wild south-east coast",
    region: "South Coast",
    tags: ["Wildlife", "Nature"],
    lat: 6.4,
    lng: 81.47,
    photo: "leopard",
    gallery: ["leopardTree", "deer", "peacock", "elephantFamily"],
    summary: [
      "Yala is the island's most famous national park: nearly a thousand square kilometres of scrub jungle, lagoons and rock outcrops running down to an empty shore.",
      "Its first block has one of the highest densities of leopards recorded anywhere, and the open terrain makes them unusually easy to see. Elephants, sloth bears, crocodiles, wild buffalo and well over 200 species of bird share the park.",
    ],
    highlights: [
      { title: "Leopards", text: "Often spotted draped over a branch or a sun-warmed boulder in the early morning." },
      { title: "Sloth bears", text: "Easiest to find from May to July, when they climb palu trees for ripe fruit." },
      { title: "Lagoons and coast", text: "Painted storks, pelicans and peacocks against a backdrop of surf." },
    ],
    best: [2, 3, 4, 5, 6, 7],
    stay: "1–2 days",
    getThere: "Safaris leave from Tissamaharama and Kirinda, around 2½ hours from Ella and 3 hours from Mirissa.",
    tips: [
      "Dawn and late-afternoon drives are best; a full day takes you away from the busiest tracks.",
      "Part of the park usually closes for some weeks around September — check before you plan.",
      "Ask for a driver who will not race to sightings.",
    ],
    nearby: ["ella", "mirissa", "arugam-bay"],
  },
  {
    slug: "trincomalee",
    name: "Trincomalee",
    native: "திருகோணமலை",
    tagline: "A great natural harbour and long, calm beaches",
    region: "East Coast",
    tags: ["Beach", "Heritage", "Wildlife"],
    lat: 8.57,
    lng: 81.19,
    photo: "trincoSunset",
    gallery: ["trincoBoat", "trincoShore"],
    summary: [
      "Trincomalee wraps around one of the finest deep-water harbours in the world. When the south-west coast is under monsoon cloud, the east is at its best: the sea flat and clear, the sand at Nilaveli and Uppuveli nearly empty.",
      "On a cliff above the town the Koneswaram temple looks out over the bay, and just offshore Pigeon Island's coral gardens offer some of the island's best snorkelling.",
    ],
    highlights: [
      { title: "Nilaveli & Uppuveli", text: "Kilometres of pale sand and shallow water north of town." },
      { title: "Pigeon Island", text: "A marine national park with coral, reef fish, turtles and harmless blacktip reef sharks." },
      { title: "Koneswaram Temple", text: "A Hindu shrine on Swami Rock, high above the harbour inside Fort Frederick." },
      { title: "Whales and dolphins", text: "Boat trips look for them roughly from March to August." },
    ],
    best: [4, 5, 6, 7, 8, 9],
    stay: "2–3 days",
    getThere: "About 2 hours from Sigiriya by road, or 6–7 hours from Colombo; there is also an overnight train.",
    tips: [
      "Do not stand on or touch coral at Pigeon Island; visitor numbers are limited, so book ahead.",
      "From October to January the north-east monsoon brings heavy rain and rough seas.",
    ],
    nearby: ["polonnaruwa", "anuradhapura", "sigiriya"],
  },
  {
    slug: "arugam-bay",
    name: "Arugam Bay",
    native: "ආරුගම් බොක්ක",
    tagline: "A long right-hand point break and a slower pace",
    region: "East Coast",
    tags: ["Surf", "Beach", "Wildlife"],
    lat: 6.84,
    lng: 81.8,
    photo: "arugam",
    gallery: [],
    summary: [
      "A fishing village on a moon-shaped bay, Arugam Bay has been on surfers' maps for decades. From May to October a clean swell wraps around the southern point and peels for hundreds of metres.",
      "Even if you never touch a board, it is an easy place to like: hammocks, seafood, lagoon safaris among crocodiles and elephants, and the little-visited Kumana National Park to the south.",
    ],
    highlights: [
      { title: "Main Point", text: "The famous right-hander at the south end of the bay." },
      { title: "Whiskey Point & Peanut Farm", text: "Mellow breaks up and down the coast for learners and longboarders." },
      { title: "Kumana & Kudumbigala", text: "A bird-rich park and a forest hermitage on a rock with wide views." },
    ],
    best: [5, 6, 7, 8, 9, 10],
    stay: "3–5 days",
    getThere: "About 3 hours east of Ella by road and 7–8 hours from Colombo. Pottuvil is the nearest town.",
    tips: [
      "Outside the season many places close and the sea is rough.",
      "Wild elephants cross the roads around the lagoon at dusk — drive slowly.",
    ],
    nearby: ["yala", "ella", "trincomalee"],
  },
  {
    slug: "jaffna",
    name: "Jaffna",
    native: "யாழ்ப்பாணம்",
    tagline: "The Tamil north: temples, islands and palmyra palms",
    region: "The North",
    tags: ["Heritage", "City"],
    lat: 9.66,
    lng: 80.04,
    photo: "nallur",
    gallery: ["pongal"],
    summary: [
      "At the island's northern tip, Jaffna feels like another country: dry, flat and bright, with Hindu temples in place of stupas, palmyra palms instead of coconut, and a cuisine all of its own.",
      "The great Nallur Kandaswamy Kovil is the centre of city life, a star-shaped fort stands over the lagoon, and causeways and ferries lead out to low islands where wild ponies graze.",
    ],
    highlights: [
      { title: "Nallur Kandaswamy Kovil", text: "A golden-towered temple whose 25-day festival each August is the biggest event in the north." },
      { title: "Jaffna Fort", text: "Begun by the Portuguese, rebuilt by the Dutch, with wide lagoon views from its walls." },
      { title: "The islands", text: "Take the boat to Nainativu's two shrines or to Delft with its coral walls and ponies." },
      { title: "Jaffna cooking", text: "Fiery crab curry, palmyra-root dishes and some of the best mangoes on the island." },
    ],
    best: [2, 3, 4, 5, 6, 7, 8, 9],
    stay: "2–3 days",
    getThere: "Six to seven hours from Colombo on the northern railway, or about 3 hours by road from Anuradhapura.",
    tips: [
      "At Hindu temples remove shoes, and men are asked to remove shirts before entering Nallur.",
      "Temples close in the early afternoon; visit for the morning or evening puja.",
    ],
    nearby: ["anuradhapura", "trincomalee"],
  },
];

export function getDestination(slug: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.slug === slug);
}

/* ------------------------------------------------------------------ */

export interface AtlasStep {
  id: string;
  kicker: string;
  title: string;
  text: string;
  slugs: string[];
  region?: Region;
  view: View;
}

export const ATLAS: AtlasStep[] = [
  {
    id: "island",
    kicker: "The island",
    title: "One island, a whole world",
    text: "Sri Lanka is about the size of Ireland. In a single day you can leave a palm-lined beach, climb through tea country and sleep in a city founded before Rome was an empire.",
    slugs: ["colombo", "kandy", "sigiriya", "galle", "trincomalee", "jaffna"],
    view: { lat: 7.85, lng: 80.75, dist: 11.5, az: 0.3, pol: 0.74 },
  },
  {
    id: "culture",
    kicker: "Cultural Triangle",
    title: "Kingdoms in the dry plains",
    text: "Between three ancient capitals lie rock citadels, painted caves and reservoirs built two thousand years ago — and herds of wild elephants that still come to drink at them.",
    slugs: ["sigiriya", "dambulla", "anuradhapura", "polonnaruwa", "minneriya"],
    region: "Cultural Triangle",
    view: { lat: 8.05, lng: 80.72, dist: 6.2, az: -0.35, pol: 0.82 },
  },
  {
    id: "hills",
    kicker: "Hill Country",
    title: "Tea, mist and mountain railways",
    text: "The centre of the island rises to more than 2,500 metres. Trains thread through estates and cloud forest between Kandy, Nuwara Eliya and Ella.",
    slugs: ["kandy", "nuwara-eliya", "ella", "horton-plains", "adams-peak"],
    region: "Hill Country",
    view: { lat: 6.95, lng: 80.76, dist: 4.9, az: 0.55, pol: 1.0 },
  },
  {
    id: "south",
    kicker: "South Coast",
    title: "Forts, surf and blue whales",
    text: "From the ramparts of Galle to the leopard country of Yala, the south is a ribbon of coves and fishing harbours — at its best from November to April.",
    slugs: ["galle", "weligama", "mirissa", "yala"],
    region: "South Coast",
    view: { lat: 6.25, lng: 80.8, dist: 5.4, az: 0.1, pol: 0.86 },
  },
  {
    id: "east",
    kicker: "East Coast",
    title: "The other season",
    text: "When the monsoon reaches the south-west, the east turns calm and clear. Trincomalee has the snorkelling; Arugam Bay has the waves.",
    slugs: ["trincomalee", "arugam-bay"],
    region: "East Coast",
    view: { lat: 7.65, lng: 81.35, dist: 6.0, az: 1.05, pol: 0.86 },
  },
  {
    id: "north",
    kicker: "The North",
    title: "Jaffna and the islands",
    text: "The Tamil heartland: gold-towered kovils, a Dutch fort on the lagoon, and causeways running out across shallow sea to islands of palmyra palms.",
    slugs: ["jaffna", "anuradhapura"],
    region: "The North",
    view: { lat: 9.2, lng: 80.35, dist: 5.4, az: -0.5, pol: 0.78 },
  },
];

/* ------------------------------------------------------------------ */

export interface Experience {
  slug: string;
  title: string;
  photo: PhotoKey;
  blurb: string;
  where: string;
  when: string;
  links: string[];
  note?: string;
}

export const EXPERIENCES: Experience[] = [
  {
    slug: "train",
    title: "Ride the hill-country railway",
    photo: "train",
    blurb: "Seven slow hours from Kandy to Ella through tunnels, tea estates and cloud forest, with the carriage doors open to the valley. Often called one of the most beautiful train journeys in the world — and a ticket costs less than lunch.",
    where: "Kandy → Nanu Oya → Ella",
    when: "All year; clearest January to April",
    links: ["kandy", "nuwara-eliya", "ella"],
  },
  {
    slug: "safari",
    title: "Track leopards and elephants",
    photo: "leopard",
    blurb: "Few countries pack so much wildlife into so small a space. Look for leopards in Yala and Wilpattu, watch elephant families at Udawalawe, and see hundreds gather at Minneriya in the dry season.",
    where: "Yala, Udawalawe, Wilpattu, Minneriya",
    when: "February to October, varying by park",
    links: ["yala", "minneriya"],
  },
  {
    slug: "whales",
    title: "Meet the blue whale",
    photo: "whale",
    blurb: "Sri Lanka is one of the most reliable places to see the largest animal on the planet. Boats leave Mirissa at dawn in the winter months and Trincomalee in the middle of the year.",
    where: "Mirissa · Trincomalee",
    when: "Nov–Apr in the south; about Mar–Aug in the east",
    links: ["mirissa", "trincomalee"],
    note: "Illustrative photograph of a whale fluke.",
  },
  {
    slug: "surf",
    title: "Surf two coasts, two seasons",
    photo: "weligama",
    blurb: "Warm water and a wave somewhere all year. Learn on the soft beach break at Weligama in winter; follow the swell to the long point breaks of Arugam Bay in summer.",
    where: "Weligama, Hikkaduwa, Arugam Bay",
    when: "Nov–Apr south-west; May–Oct east",
    links: ["weligama", "arugam-bay"],
  },
  {
    slug: "tea",
    title: "Walk the tea trails",
    photo: "teaPicker",
    blurb: "Follow a path between the bushes, see two leaves and a bud become black tea in a hundred-year-old factory, and taste the difference a few hundred metres of altitude makes.",
    where: "Nuwara Eliya, Hatton, Haputale, Ella",
    when: "All year",
    links: ["nuwara-eliya", "ella"],
  },
  {
    slug: "sunrise",
    title: "Climb for the sunrise",
    photo: "sigiriyaFar",
    blurb: "Scramble up Pidurangala to watch first light hit Sigiriya, join the pilgrims on Adam's Peak, or reach World's End before the cloud does.",
    where: "Pidurangala, Adam's Peak, Horton Plains, Little Adam's Peak",
    when: "Dry mornings; Adam's Peak Dec–May",
    links: ["sigiriya", "adams-peak", "horton-plains"],
  },
  {
    slug: "reef",
    title: "Snorkel with turtles",
    photo: "turtle",
    blurb: "Five of the world's seven sea-turtle species nest on Sri Lankan beaches. Drift over coral at Pigeon Island, or watch a green turtle lay her eggs on a night walk at Rekawa.",
    where: "Pigeon Island, Hikkaduwa, Rekawa",
    when: "East coast May–Sep; south coast Nov–Apr",
    links: ["trincomalee", "weligama"],
  },
  {
    slug: "dance",
    title: "Feel the drums of Kandy",
    photo: "dancer",
    blurb: "Kandyan dance is all leaps, spins and thunderous drumming, performed in silver headdresses and beaded harnesses. See it nightly in Kandy — or in full glory at the Esala Perahera.",
    where: "Kandy",
    when: "Nightly; Perahera in July or August",
    links: ["kandy"],
  },
  {
    slug: "ayurveda",
    title: "Slow down with Ayurveda",
    photo: "compress",
    blurb: "The island's healing tradition goes back thousands of years. Retreats along the south and west coasts offer herbal baths, oil treatments and plant-based cooking prescribed by a physician.",
    where: "Bentota, Beruwala, Weligama, hill-country retreats",
    when: "All year",
    links: ["weligama", "galle"],
    note: "Illustrative photograph of a herbal compress treatment.",
  },
  {
    slug: "tuktuk",
    title: "Go by tuk-tuk",
    photo: "tuktuk",
    blurb: "The three-wheeler is how Sri Lanka gets around. Hop in for a short ride across town — or, with the right licence, rent your own and take the back roads.",
    where: "Everywhere",
    when: "All year",
    links: ["colombo", "galle"],
  },
];

/* ------------------------------------------------------------------ */

export type Outlook = 0 | 1 | 2;

export interface ClimateRow {
  id: string;
  label: string;
  regions: Region[];
  months: Outlook[];
  note: string;
}

/** Typical conditions: 2 = best, 1 = mixed, 0 = wet season. */
export const CLIMATE: ClimateRow[] = [
  {
    id: "south-west",
    label: "South & west coasts",
    regions: ["South Coast", "West Coast"],
    months: [2, 2, 2, 2, 0, 0, 1, 1, 1, 0, 1, 2],
    note: "Calm seas and blue skies from December to April. The south-west monsoon brings rain and rough surf from May.",
  },
  {
    id: "hills",
    label: "Hill country",
    regions: ["Hill Country"],
    months: [2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 1],
    note: "Clearest from January to April. Ella and the eastern slopes stay drier from June to September.",
  },
  {
    id: "culture",
    label: "Cultural Triangle",
    regions: ["Cultural Triangle"],
    months: [1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
    note: "Hot and dry for most of the year. The north-east monsoon brings rain from October to January.",
  },
  {
    id: "east",
    label: "East coast",
    regions: ["East Coast"],
    months: [0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0],
    note: "At its best from April to September, exactly when the south-west is wet.",
  },
  {
    id: "north",
    label: "The north",
    regions: ["The North"],
    months: [1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
    note: "Dry and sunny from February to September; heavy rain late in the year.",
  },
];

export const OUTLOOK_LABEL: Record<Outlook, string> = { 2: "Best", 1: "Mixed", 0: "Wet season" };

/* ------------------------------------------------------------------ */

export interface Festival {
  name: string;
  months: number[];
  when: string;
  where: string;
  text: string;
}

export const FESTIVALS: Festival[] = [
  { name: "Thai Pongal", months: [1], when: "Mid-January", where: "Jaffna, the east and the hill country", text: "The Tamil harvest festival. Families boil the first rice of the season in milk until it spills over, as thanks to the sun." },
  { name: "Duruthu Perahera", months: [1], when: "January full moon", where: "Kelaniya, near Colombo", text: "A torch-lit procession of dancers, drummers and elephants marking the Buddha's first visit to the island." },
  { name: "Independence Day", months: [2], when: "4 February", where: "Islandwide", text: "Parades and flag-raising commemorate independence in 1948." },
  { name: "Navam Perahera", months: [2], when: "February full moon", where: "Gangaramaya, Colombo", text: "The capital's great pageant winds around Beira Lake over two nights." },
  { name: "Sinhala & Tamil New Year", months: [4], when: "13–14 April", where: "Islandwide", text: "The whole country goes home. Hearths are lit at an auspicious minute, milk rice is shared, and villages play traditional games. Expect closures and full trains." },
  { name: "Vesak", months: [5], when: "May full moon", where: "Islandwide, especially Colombo", text: "The birth, enlightenment and passing of the Buddha. Streets glow with paper lanterns and illuminated pandals, and roadside stalls give away free food and drink." },
  { name: "Poson", months: [6], when: "June full moon", where: "Mihintale & Anuradhapura", text: "Marks the arrival of Buddhism. Thousands of pilgrims in white climb the steps of Mihintale." },
  { name: "Kandy Esala Perahera", months: [7, 8], when: "Ten nights in July or August", where: "Kandy", text: "One of Asia's great spectacles: whip-crackers, fire dancers, hundreds of drummers and a long line of elephants escorting the casket of the Sacred Tooth." },
  { name: "Kataragama Festival", months: [7, 8], when: "July or August", where: "Kataragama", text: "Pilgrims of several faiths converge on the jungle shrine, some after walking the length of the east coast." },
  { name: "Nallur Festival", months: [8], when: "25 days in August", where: "Jaffna", text: "Chariot processions and devotion on a huge scale at the Nallur Kandaswamy Kovil." },
  { name: "Deepavali", months: [10, 11], when: "October or November", where: "Tamil communities islandwide", text: "The Hindu festival of lights: oil lamps, new clothes and sweets." },
  { name: "Adam's Peak season opens", months: [12], when: "December full moon", where: "Sri Pada", text: "The pilgrimage season begins and the path to the summit is lit until Vesak in May." },
  { name: "Christmas", months: [12], when: "25 December", where: "Negombo, Colombo and the west coast", text: "Celebrated with midnight masses and street decorations, especially along the Catholic coast north of Colombo." },
];

/* ------------------------------------------------------------------ */

export interface Dish {
  name: string;
  local: string;
  kind: "Staple" | "Street food" | "Curry" | "Sweet" | "Festive";
  text: string;
}

export const DISHES: Dish[] = [
  { name: "Rice & curry", local: "bath saha vyanjana", kind: "Staple", text: "The national meal: a mound of rice ringed by anything from four to a dozen small dishes — dhal, jackfruit, beetroot, fish or chicken, shredded greens with coconut, a fiery sambol and a papadam to crush over the top." },
  { name: "Hoppers", local: "appa", kind: "Staple", text: "Bowl-shaped pancakes of fermented rice flour and coconut milk, lacy at the rim and soft at the centre. Order one with an egg cooked into the base and eat it with chilli-onion lunu miris." },
  { name: "String hoppers", local: "indi appa", kind: "Staple", text: "Steamed nests of fine rice noodles, served at breakfast with a mild coconut-milk gravy and fresh coconut sambol." },
  { name: "Kottu roti", local: "kottu", kind: "Street food", text: "Flatbread chopped on a hot griddle with vegetables, egg and spices. You hear a kottu stall before you see it — the cook's twin blades beat out a rhythm you can follow down the street." },
  { name: "Pol sambol", local: "pol sambola", kind: "Staple", text: "Freshly scraped coconut pounded with chilli, red onion, lime and dried fish. It goes with everything and appears at every meal." },
  { name: "Ambul thiyal", local: "sour fish curry", kind: "Curry", text: "A dry curry from the south coast: firm tuna simmered with black pepper and goraka, a sour dried fruit that gives the dish its dark colour and tang." },
  { name: "Jaffna crab curry", local: "nandu kari", kind: "Curry", text: "The pride of the north — lagoon crab in a deep red gravy of roasted spices. Messy, hot and unforgettable." },
  { name: "Lamprais", local: "lomprijst", kind: "Festive", text: "A Dutch Burgher inheritance: rice cooked in stock with mixed-meat curry, aubergine pickle and a meatball, wrapped in a banana leaf and baked." },
  { name: "Kiribath", local: "milk rice", kind: "Festive", text: "Rice cooked in coconut milk and cut into diamonds. It is the first food eaten at New Year and on any auspicious morning." },
  { name: "Isso wade", local: "prawn fritters", kind: "Street food", text: "Crisp lentil cakes topped with whole prawns, sold from carts on Colombo's Galle Face Green at sunset." },
  { name: "Curd & treacle", local: "meekiri saha kithul pani", kind: "Sweet", text: "Thick buffalo curd set in clay pots and drizzled with the smoky syrup of the kithul palm. Look for roadside stalls in the deep south." },
  { name: "Watalappan", local: "vattalappam", kind: "Sweet", text: "A steamed custard of coconut milk, palm jaggery and cardamom brought by the island's Malay community and loved by everyone." },
];

export const DRINKS: { name: string; text: string }[] = [
  { name: "Ceylon tea", text: "Drunk plain and strong, or milky and sweet from a roadside kiosk." },
  { name: "King coconut", text: "The orange thambili, opened with a machete at the roadside — nature's own rehydration drink." },
  { name: "Wood-apple juice", text: "A hard-shelled fruit blended with jaggery into something between tamarind and toffee." },
  { name: "Ginger beer", text: "Fiery, locally brewed and found in every shop fridge." },
  { name: "Faluda", text: "Rose syrup, milk, basil seeds and ice cream in a tall glass." },
  { name: "Arrack", text: "A smooth spirit distilled from the sap of the coconut flower, collected by tappers who walk ropes between the palms." },
];

export const TEA_REGIONS: { name: string; height: string; cup: string }[] = [
  { name: "Nuwara Eliya", height: "High-grown, around 1,900 m", cup: "Pale, delicate and floral — the lightest of all Ceylon teas." },
  { name: "Dimbula", height: "High-grown western slopes", cup: "Golden-orange and crisp; classic afternoon tea." },
  { name: "Uva", height: "High-grown eastern slopes", cup: "Aromatic with a distinctive brisk character, at its peak in the dry months of July to September." },
  { name: "Uda Pussellawa", height: "High-grown, north-east of Nuwara Eliya", cup: "Medium-bodied with a rosy tint." },
  { name: "Kandy", height: "Mid-grown", cup: "Full-bodied and coppery. Commercial tea-growing began near here in 1867." },
  { name: "Sabaragamuwa", height: "Low-grown", cup: "Dark and smooth with a hint of caramel." },
  { name: "Ruhuna", height: "Low-grown in the south", cup: "Strong, black and malty — made for milk." },
];

export const SPICES: { name: string; text: string }[] = [
  { name: "Cinnamon", text: "True cinnamon is native to Sri Lanka. Peelers on the south-west coast still roll the inner bark into quills by hand." },
  { name: "Black pepper", text: "The original heat of the island's cooking, long before chillies arrived from the Americas." },
  { name: "Cardamom", text: "Grown in the shade of hill forests and used in both curries and sweets." },
  { name: "Cloves & nutmeg", text: "Spice gardens around Matale and Kandy show how they grow." },
  { name: "Curry leaves & pandan", text: "The fresh green scent in almost every pot." },
  { name: "Goraka", text: "A dried sour fruit that both flavours and preserves fish curries." },
];

/* ------------------------------------------------------------------ */

export const ANIMALS: { name: string; latin: string; photo: PhotoKey; text: string; where: string }[] = [
  { name: "Sri Lankan elephant", latin: "Elephas maximus maximus", photo: "elephantFamily", text: "The largest subspecies of Asian elephant. Several thousand live wild on the island — one of the highest densities in Asia — and they are seen in almost every lowland park.", where: "Udawalawe, Minneriya, Kaudulla, Yala, Gal Oya" },
  { name: "Sri Lankan leopard", latin: "Panthera pardus kotiya", photo: "leopardTree", text: "The island's top predator, with no lions or tigers to compete with. That confidence makes it more visible here than almost anywhere else.", where: "Yala, Wilpattu, Kumana, Horton Plains" },
  { name: "Blue whale", latin: "Balaenoptera musculus", photo: "whale", text: "Blue whales are found off the south and east coasts for much of the year, feeding where the seabed drops steeply away.", where: "Mirissa, Trincomalee" },
  { name: "Sea turtles", latin: "Five nesting species", photo: "turtle", text: "Green, olive ridley, hawksbill, loggerhead and leatherback turtles all come ashore to nest. Community projects protect the beaches.", where: "Rekawa, Kosgoda, Hikkaduwa" },
  { name: "Peafowl & endemic birds", latin: "More than 30 endemic species", photo: "peacock", text: "Peacocks strut through every dry-zone park, while the wet-zone forests hold birds found nowhere else — including the national bird, the Sri Lanka junglefowl.", where: "Sinharaja, Bundala, Kumana, Horton Plains" },
  { name: "Spotted deer & more", latin: "Axis axis ceylonensis", photo: "deer", text: "Herds of spotted deer, sambar, wild buffalo, mugger crocodiles, sloth bears and three species of monkey fill in the rest of the picture.", where: "Yala, Wilpattu, Wasgamuwa" },
];

export const PARKS: { name: string; star: string; best: string; note: string }[] = [
  { name: "Yala", star: "Leopard, elephant, sloth bear", best: "February – July", note: "The most visited park; open scrub and coast in the south-east." },
  { name: "Udawalawe", star: "Elephant", best: "All year", note: "Near-guaranteed elephant sightings around a large reservoir." },
  { name: "Wilpattu", star: "Leopard, sloth bear", best: "February – October", note: "The largest park: forest dotted with natural lakes, and far fewer jeeps." },
  { name: "Minneriya & Kaudulla", star: "The elephant Gathering", best: "July – October", note: "Hundreds of elephants on the reservoir bed in the dry season." },
  { name: "Horton Plains", star: "Sambar, endemic birds", best: "January – March", note: "Montane grassland and cloud forest; explored on foot." },
  { name: "Sinharaja", star: "Rainforest birds, lizards, butterflies", best: "January – April, August – September", note: "The island's last great lowland rainforest, a World Heritage Site." },
  { name: "Bundala", star: "Flamingos and migrant waders", best: "September – March", note: "Coastal lagoons and salt pans; the country's first Ramsar wetland." },
  { name: "Kumana", star: "Nesting waterbirds, leopard", best: "April – July", note: "Remote mangrove and lagoon country beyond Arugam Bay." },
  { name: "Gal Oya", star: "Elephants swimming between islands", best: "March – July", note: "The only park explored by boat." },
  { name: "Pigeon Island", star: "Coral, reef sharks, turtles", best: "May – September", note: "A marine national park off Nilaveli." },
];

/* ------------------------------------------------------------------ */

export const UNESCO: { name: string; year: number; kind: "Cultural" | "Natural"; slug?: string; text: string }[] = [
  { name: "Sacred City of Anuradhapura", year: 1982, kind: "Cultural", slug: "anuradhapura", text: "The first capital and its sacred Bodhi tree." },
  { name: "Ancient City of Polonnaruwa", year: 1982, kind: "Cultural", slug: "polonnaruwa", text: "The medieval capital of Parakramabahu the Great." },
  { name: "Ancient City of Sigiriya", year: 1982, kind: "Cultural", slug: "sigiriya", text: "A fifth-century palace on a rock." },
  { name: "Sinharaja Forest Reserve", year: 1988, kind: "Natural", text: "Primary lowland rainforest rich in endemic species." },
  { name: "Sacred City of Kandy", year: 1988, kind: "Cultural", slug: "kandy", text: "The last royal capital and the Temple of the Tooth." },
  { name: "Old Town of Galle and its Fortifications", year: 1988, kind: "Cultural", slug: "galle", text: "A fortified port city shaped by the Dutch." },
  { name: "Rangiri Dambulla Cave Temple", year: 1991, kind: "Cultural", slug: "dambulla", text: "Five painted cave shrines." },
  { name: "Central Highlands of Sri Lanka", year: 2010, kind: "Natural", slug: "horton-plains", text: "Horton Plains, the Peak Wilderness and the Knuckles range." },
];

export const TIMELINE: { when: string; text: string }[] = [
  { when: "5th century BCE", text: "The Mahavamsa chronicle places the arrival of Prince Vijaya and the beginnings of the Sinhalese kingdom in this era." },
  { when: "377 BCE", text: "Anuradhapura becomes the capital. It will remain one for more than a thousand years." },
  { when: "3rd century BCE", text: "Buddhism reaches the island when the monk Mahinda meets King Devanampiya Tissa at Mihintale." },
  { when: "477–495 CE", text: "King Kashyapa builds his palace on the summit of Sigiriya." },
  { when: "11th–13th centuries", text: "Polonnaruwa flourishes; Parakramabahu I builds vast reservoirs and declares that no drop of rain should reach the sea unused." },
  { when: "1505", text: "The Portuguese arrive, followed by the Dutch in the seventeenth century and the British at the end of the eighteenth." },
  { when: "1815", text: "The kingdom of Kandy, independent until now, comes under British rule." },
  { when: "1867", text: "James Taylor plants the first commercial tea estate at Loolecondera. Ceylon tea is born." },
  { when: "1948", text: "Independence, on 4 February." },
  { when: "1972", text: "The country becomes a republic and takes the name Sri Lanka." },
];

export const CRAFTS: { name: string; where: string; text: string }[] = [
  { name: "Masks", where: "Ambalangoda", text: "Carved from light kaduru wood and painted in blazing colour — demon masks for healing rituals, and character masks for folk theatre." },
  { name: "Kandyan dance & drumming", where: "Kandy", text: "Dancers in silver headdresses leap to the double-headed geta beraya drum, an art once reserved for temple ritual." },
  { name: "Batik", where: "South-west coast, Kandy", text: "Wax-resist dyeing adopted and made local, with elephants, peacocks and perahera scenes." },
  { name: "Lacquer work", where: "Matale district", text: "Wooden staffs, boxes and bowls banded in red, yellow, black and green — the colours this site is built from." },
  { name: "Gems", where: "Ratnapura", text: "The 'city of gems' has supplied sapphires to the world for more than two thousand years." },
  { name: "Beeralu lace", where: "Galle and the south", text: "Bobbin lace introduced in the colonial era and still made on cushions in village doorways." },
  { name: "Brass & silver", where: "Around Kandy", text: "Oil lamps, trays and betel boxes chased with lotus and vine patterns." },
  { name: "Handloom", where: "Islandwide", text: "Bright cotton saris, sarongs and furnishings woven on wooden looms." },
];

export const ETIQUETTE: string[] = [
  "Cover shoulders and knees at any religious site, and remove shoes and hats before entering.",
  "Never pose with your back to a Buddha image, and do not touch or climb on statues.",
  "Tattoos or clothing showing the Buddha can cause serious offence and trouble with the authorities — keep them covered.",
  "Monks are treated with great respect; offer your seat, and women should avoid physical contact.",
  "Eat, give and receive with your right hand.",
  "Ask before photographing people, especially pilgrims and at ceremonies.",
  "Every full moon is a Poya day — a public holiday on which alcohol is not sold.",
];

export const PHRASES: { en: string; si: string; siSay: string; ta: string; taSay: string }[] = [
  { en: "Hello / welcome", si: "ආයුබෝවන්", siSay: "Ayubowan", ta: "வணக்கம்", taSay: "Vanakkam" },
  { en: "Thank you", si: "ස්තූතියි", siSay: "Istuti", ta: "நன்றி", taSay: "Nandri" },
  { en: "How are you?", si: "කොහොමද?", siSay: "Kohomada?", ta: "எப்படி இருக்கிறீர்கள்?", taSay: "Eppadi irukkireergal?" },
  { en: "Yes", si: "ඔව්", siSay: "Ow", ta: "ஆம்", taSay: "Aam" },
  { en: "No", si: "නැහැ", siSay: "Naha", ta: "இல்லை", taSay: "Illai" },
  { en: "OK / good", si: "හරි", siSay: "Hari", ta: "சரி", taSay: "Sari" },
  { en: "How much is this?", si: "මේක කීයද?", siSay: "Meka keeyada?", ta: "இது எவ்வளவு?", taSay: "Idhu evvalavu?" },
  { en: "Water", si: "වතුර", siSay: "Wathura", ta: "தண்ணீர்", taSay: "Thanneer" },
  { en: "Delicious!", si: "රසයි!", siSay: "Rasai!", ta: "சுவையாக இருக்கிறது!", taSay: "Suvaiyaga irukkirathu!" },
  { en: "Sorry / excuse me", si: "සමාවෙන්න", siSay: "Samawenna", ta: "மன்னிக்கவும்", taSay: "Mannikkavum" },
];

/* ------------------------------------------------------------------ */

export interface Itinerary {
  slug: string;
  title: string;
  days: number;
  pace: string;
  best: string;
  photo: PhotoKey;
  intro: string;
  stops: { days: string; place: string; slug?: string; text: string }[];
}

export const ITINERARIES: Itinerary[] = [
  {
    slug: "heritage-and-hills",
    title: "Heritage & Hills",
    days: 7,
    pace: "Brisk",
    best: "January – April",
    photo: "sigiriyaMood",
    intro: "A first taste of the island for a single week: two ancient capitals, the great train ride and a few days among the tea.",
    stops: [
      { days: "1–2", place: "Sigiriya & Dambulla", slug: "sigiriya", text: "Drive straight from the airport to the Cultural Triangle. Climb Lion Rock at opening time, visit the cave temple, and take an afternoon elephant safari." },
      { days: "3–4", place: "Kandy", slug: "kandy", text: "Stop at a spice garden on the way south. Evening puja at the Temple of the Tooth, the botanic gardens, a dance performance." },
      { days: "5", place: "Train to Ella", slug: "ella", text: "Seven hours of tea estates and waterfalls from a carriage door. Arrive in time for dinner." },
      { days: "6", place: "Ella", slug: "ella", text: "Little Adam's Peak at sunrise, the Nine Arch Bridge, an afternoon at a tea factory." },
      { days: "7", place: "Return via the south", slug: "colombo", text: "Drive down to the expressway and back to Colombo or the airport — about five hours." },
    ],
  },
  {
    slug: "classic-loop",
    title: "The Classic Loop",
    days: 10,
    pace: "Balanced",
    best: "December – April",
    photo: "nineArch",
    intro: "The route most travellers fall in love with: culture, mountains, safari and beach in one easy circle.",
    stops: [
      { days: "1", place: "Negombo or Colombo", slug: "colombo", text: "Land, rest, and eat your first rice and curry beside the sea." },
      { days: "2–3", place: "Sigiriya", slug: "sigiriya", text: "Lion Rock, Pidurangala, Dambulla caves and a day cycling the ruins of Polonnaruwa." },
      { days: "4–5", place: "Kandy", slug: "kandy", text: "The Sacred Tooth, lake walks and the gardens at Peradeniya." },
      { days: "6–7", place: "Ella, by train", slug: "ella", text: "The great railway journey, then short hikes and long breakfasts." },
      { days: "8", place: "Yala", slug: "yala", text: "Drop to the plains for a dusk safari and another at dawn." },
      { days: "9", place: "Mirissa", slug: "mirissa", text: "A day on the sand; whale watching in season." },
      { days: "10", place: "Galle", slug: "galle", text: "Walk the ramparts, then take the expressway back to the airport." },
    ],
  },
  {
    slug: "slow-south",
    title: "The Slow South",
    days: 8,
    pace: "Unhurried",
    best: "November – April",
    photo: "palmOcean",
    intro: "For those who want sea air, good food and wildlife without long drives.",
    stops: [
      { days: "1–2", place: "Galle Fort", slug: "galle", text: "Colonial lanes, sunset on the walls, a cooking class in a family kitchen." },
      { days: "3–5", place: "Weligama & Mirissa", slug: "weligama", text: "Surf lessons, stilt fishermen, a morning with the whales and evenings on the beach." },
      { days: "6–7", place: "Yala or Udawalawe", slug: "yala", text: "Two days of safaris — leopards in Yala, or elephants by the dozen at Udawalawe." },
      { days: "8", place: "Back along the coast", slug: "colombo", text: "Return on the expressway with a stop for curd and treacle." },
    ],
  },
  {
    slug: "island-in-full",
    title: "The Island in Full",
    days: 14,
    pace: "Balanced",
    best: "February – April, or July – September",
    photo: "trincoBoat",
    intro: "Two weeks takes you beyond the classic loop — to the first capital, the Tamil north and the quiet east coast.",
    stops: [
      { days: "1", place: "Negombo", slug: "colombo", text: "A gentle start by the lagoon near the airport." },
      { days: "2–3", place: "Anuradhapura", slug: "anuradhapura", text: "Cycle between stupas and the sacred Bodhi tree; climb Mihintale at dusk." },
      { days: "4–5", place: "Jaffna", slug: "jaffna", text: "Nallur temple, the fort, a ferry to the islands and a proper crab curry." },
      { days: "6–7", place: "Trincomalee", slug: "trincomalee", text: "Snorkel Pigeon Island and do nothing at all on Nilaveli beach." },
      { days: "8–9", place: "Sigiriya", slug: "sigiriya", text: "Lion Rock, Polonnaruwa and the elephants of Minneriya." },
      { days: "10", place: "Kandy", slug: "kandy", text: "The Temple of the Tooth and an evening by the lake." },
      { days: "11–12", place: "Ella", slug: "ella", text: "Arrive by train; walk, rest, drink tea." },
      { days: "13–14", place: "Yala and Galle", slug: "galle", text: "One last safari, one last sunset from the ramparts." },
    ],
  },
];

/* ------------------------------------------------------------------ */

export const QUICK_FACTS: { label: string; value: string }[] = [
  { label: "Capital", value: "Sri Jayawardenepura Kotte (administrative) · Colombo (commercial)" },
  { label: "Languages", value: "Sinhala and Tamil; English is widely spoken" },
  { label: "Currency", value: "Sri Lankan rupee (LKR)" },
  { label: "Time zone", value: "UTC +5:30, no daylight saving" },
  { label: "Electricity", value: "230 V, 50 Hz · plug types G and D" },
  { label: "Driving", value: "On the left" },
  { label: "Dialling code", value: "+94" },
  { label: "Main airport", value: "Bandaranaike International (CMB), 30 km north of Colombo" },
];

export const EMERGENCY: { label: string; number: string }[] = [
  { label: "Police emergency", number: "119" },
  { label: "Ambulance (Suwa Seriya)", number: "1990" },
  { label: "Tourist hotline", number: "1912" },
  { label: "Fire & rescue", number: "110" },
];

export const FAQ: { q: string; a: string }[] = [
  { q: "Do I need a visa?", a: "Most visitors need an Electronic Travel Authorisation (ETA) or visa arranged before arrival. Rules, fees and exemptions change from time to time, so check the official Department of Immigration site at eta.gov.lk before you book." },
  { q: "How long do I need?", a: "Ten days to two weeks lets you combine the Cultural Triangle, the hills and a coast without rushing. With a week, choose two regions." },
  { q: "Is it easy to travel independently?", a: "Yes. Trains and buses reach almost everywhere, tuk-tuks fill the gaps, and hiring a car with a driver for a few days is common and good value. Distances are short but roads are slow — allow about 40 km per hour." },
  { q: "Can I drink the tap water?", a: "Stick to bottled or filtered water. Many guesthouses offer refills — bring a reusable bottle." },
  { q: "Is the food very spicy?", a: "It can be, but cooks are used to visitors and will happily tone it down. Rice, dhal, hoppers and coconut-based curries are mild, and vegetarians eat very well." },
  { q: "What should I pack?", a: "Light cotton clothing, something that covers shoulders and knees for temples, a warm layer for the hills, sun protection, insect repellent and a universal plug adaptor." },
  { q: "How do I get a SIM card?", a: "Tourist SIMs with data are sold at the airport arrivals hall and in every town. Coverage is good except in remote national parks." },
  { q: "Is tipping expected?", a: "It is appreciated. Around 10% in restaurants where no service charge is added, and something for drivers, guides and safari trackers." },
];

export const GETTING_AROUND: { mode: string; text: string }[] = [
  { mode: "Train", text: "Slow, cheap and scenic. The main line climbs from Colombo through Kandy to Ella and Badulla; the coastal line runs to Galle and beyond; the northern line reaches Jaffna. Reserve the popular hill-country trains in advance." },
  { mode: "Bus", text: "Goes everywhere, often. Red state buses and private ones cost very little; air-conditioned intercity services run on the expressways." },
  { mode: "Car & driver", text: "The most comfortable way to link several regions. Drivers double as guides and fixers." },
  { mode: "Tuk-tuk", text: "For short hops. Agree the fare first or use a meter or app in larger towns." },
  { mode: "Domestic flights", text: "Small aircraft and seaplanes link Colombo with the east coast, the south and the hill-country lakes." },
];
