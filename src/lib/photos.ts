export interface PhotoInfo {
  id: number;
  alt: string;
  by: string;
}

const p = (id: number, alt: string, by: string): PhotoInfo => ({ id, alt, by });

/**
 * Every photograph on the site, keyed by what it actually shows.
 * All images are real photographs from Pexels contributors.
 */
export const PHOTOS = {
  sigiriya: p(19574565, "Sigiriya, the Lion Rock, rising above the forest canopy", "Andreas Schnabl"),
  sigiriyaFar: p(3869004, "Sigiriya seen across the jungle from Pidurangala", "Andreas Schnabl"),
  sigiriyaMood: p(12185842, "Sigiriya rock framed by leaves under a moody sky", "Ana"),
  sigiriyaView: p(39604841, "The view across forest and lakes from the summit of Sigiriya", "azra melek"),
  sigiriyaGardens: p(32547969, "The symmetrical water gardens of Sigiriya seen from above", "Samiru Sandeepa"),
  nineArchTrain: p(4769075, "A blue train crossing the Nine Arch Bridge near Ella", "Domenico Bertazzo"),
  nineArch: p(595196, "The Nine Arch Bridge curving through jungle and tea", "Saleem Akthar"),
  nineArchTea: p(19758641, "Tea bushes growing beneath the stone arches of the Nine Arch Bridge", "Melson Dreams"),
  kandyTemple: p(14041994, "The octagonal pavilion of the Temple of the Sacred Tooth Relic in Kandy", "Chathura Anuradha Subasinghe"),
  kandyLake: p(40442090, "A white pavilion and cloud wall beside Kandy Lake", "Thilina Alagiyawanna"),
  kandyGardens: p(40442115, "Devotees in white walking through temple gardens in Kandy", "Thilina Alagiyawanna"),
  kandyHotel: p(20836970, "Colonial-era hotel facade in the centre of Kandy", "Gihan Bandara"),
  galleLighthouse: p(19431302, "The white lighthouse of Galle Fort among palm trees", "Andreas Schnabl"),
  galleWall: p(11116033, "The ramparts of Galle Fort meeting the Indian Ocean", "Charith Kodagoda"),
  galleClock: p(31032902, "The stone clock tower of Galle Fort against a blue sky", "Thilina Alagiyawanna"),
  galleCafe: p(39548738, "A café entrance on a quiet street inside Galle Fort", "Thilina Alagiyawanna"),
  teaPicker: p(26576014, "A tea plucker working among bright green bushes near Nuwara Eliya", "pradeep weragoda"),
  teaHills: p(36847090, "Tea terraces covering a hillside in the hill country", "Thilina Alagiyawanna"),
  hillFalls: p(15221178, "A tiered waterfall in the hills near Nuwara Eliya", "Niroshan Chandana"),
  ruwanweli: p(37091540, "The white dome and spire of Ruwanwelisaya in Anuradhapura", "Roshan Kumara"),
  ruwanweliTrees: p(10638034, "Ruwanwelisaya stupa framed by old tree branches", "Rathna Deepaya"),
  polonnaruwa: p(12584869, "Stone terraces and ruins in the ancient city of Polonnaruwa", "Rathna Deepaya"),
  polonnaruwaLion: p(39339586, "Carved columns and a stone lion in Polonnaruwa", "Thilina Alagiyawanna"),
  polonnaruwaPalace: p(39339599, "Massive brick walls of the royal palace in Polonnaruwa", "Thilina Alagiyawanna"),
  colombo: p(33511789, "Colombo skyline with the Lotus Tower in morning haze", "Sofiia Asmi"),
  colomboNight: p(30379285, "Colombo towers reflected in water at night", "Namal Siriwardana"),
  colomboBuddhas: p(6845299, "A row of golden Buddha statues beside the water in Colombo", "Kalpa Chathuranga"),
  streetFood: p(40156157, "A lit street-food cart on the Colombo seafront at night", "Thilina Alagiyawanna"),
  mirissaPalms: p(9615257, "Coconut palms above turquoise surf at Mirissa", "Charith Kodagoda"),
  mirissaBeach: p(5675024, "Footprints on an empty beach at Mirissa in soft morning light", "Charith Kodagoda"),
  palmOcean: p(11496553, "A single palm leaning over the ocean on the south coast", "esrageziyor"),
  leopard: p(10607669, "A Sri Lankan leopard drinking at a waterhole", "Janith Madhusanka"),
  leopardTree: p(13784932, "A leopard resting in the fork of a tree in Yala", "Layan Nimantha"),
  deer: p(26699207, "A spotted deer in tall grass in Yala National Park", "Ishara Kasthuriarachchi"),
  peacock: p(11479220, "Close-up of a peacock's blue neck and crest", "Ishara Kasthuriarachchi"),
  elephants: p(8126089, "A herd of wild elephants beside a reservoir", "Dr Isura Wijayalath"),
  elephantsGreen: p(27808468, "Elephants grazing on open grassland at Kaudulla", "GirlvsGlobe86"),
  elephantFamily: p(20535291, "An elephant family with a calf walking through dry forest", "Bhoopal M"),
  stiltFisher: p(6705274, "A stilt fisherman perched above the waves on the south coast", "Nilanka Sampath"),
  trincoSunset: p(10850861, "Fishermen and boats on a Trincomalee beach at sunset", "Sachith Ravishka Kodikara"),
  trincoBoat: p(10850854, "A painted fishing boat on the sand at Trincomalee", "Sachith Ravishka Kodikara"),
  trincoShore: p(10850860, "A blue fishing boat at the water's edge in Trincomalee", "Sachith Ravishka Kodikara"),
  hoppers: p(40003887, "Egg hoppers, sambols and an omelette on a breakfast table", "Saya P"),
  grilledFish: p(11388099, "Grilled fish steak with rice, vegetables and lime", "Atlantic Ambience"),
  appam: p(39851682, "Freshly made appam on a terracotta plate", "Jahra Tasfia Reza"),
  dancer: p(36638326, "A dancer in traditional costume performing at night", "Thilina Alagiyawanna"),
  drummers: p(36431760, "Drummers in red and white traditional dress in a procession", "Roshan Kumara"),
  masks: p(39422934, "Carved and painted traditional masks on a shop wall in Galle", "Thilina Alagiyawanna"),
  puppets: p(37431467, "Brightly dressed traditional string puppets", "ARTZ RooM"),
  weligama: p(35456333, "Surfers in the curve of Weligama Bay at sunset", "Charith Kodagoda"),
  weligamaBeach: p(12475123, "Gentle waves rolling onto Weligama beach", "Atlantic Ambience"),
  arugam: p(14621236, "Fishing nets and a boat on the sand at Arugam Bay", "Bo Ponomari"),
  unawatuna: p(11677391, "Palms and turquoise water at Unawatuna", "Atlantic Ambience"),
  sunrisePeaks: p(31001499, "Sunrise over mist-filled valleys in the central highlands", "Thilina Alagiyawanna"),
  sunriseValley: p(31001504, "First light over forested ridges in the hill country", "Thilina Alagiyawanna"),
  mistFalls: p(29645176, "A thin waterfall dropping through misty forest at Nallathanniya", "Namal Siriwardana"),
  dambulla: p(32547985, "A reclining Buddha beneath painted rock in the Dambulla cave temple", "Samiru Sandeepa"),
  dambullaSeated: p(32547976, "Seated Buddha statues and murals inside the Dambulla caves", "Samiru Sandeepa"),
  nallur: p(39486290, "The golden gopuram of Nallur Kandaswamy Kovil in Jaffna", "S Dhanushka M Keerthirathna"),
  pongal: p(35763757, "Bananas, an oil lamp and offerings prepared for Thai Pongal", "Dinuka Gunawardana"),
  train: p(36847103, "A train winding through forest in the hill country", "Thilina Alagiyawanna"),
  railway: p(40441999, "Railway track cut into a green hillside at Haputale", "Thilina Alagiyawanna"),
  teaPot: p(38958677, "A glass pot and cup of black tea with cinnamon and star anise", "Masuma Rahaman"),
  whale: p(31959085, "A whale's tail lifting out of deep blue water", "Neil Ni"),
  ravanaFalls: p(28773425, "Ravana Falls tumbling over rocks near Ella", "Tarana Tabassum"),
  monks: p(36537568, "Buddhist monks in saffron robes walking in procession", "Roshan Kumara"),
  vesak: p(37928407, "An illuminated Vesak pandal glowing at night", "Thilina Alagiyawanna"),
  ceremony: p(34050813, "Monks seated beneath ceremonial umbrellas", "Roshan Kumara"),
  horton: p(38343572, "Rolling montane grassland at Horton Plains", "Thilina Alagiyawanna"),
  hortonTrail: p(38343567, "A walking trail crossing Horton Plains National Park", "Thilina Alagiyawanna"),
  hortonHills: p(38343534, "Cloud shadows over the hills of Horton Plains", "Thilina Alagiyawanna"),
  tuktuk: p(11138778, "A red tuk-tuk driving along a town road", "Maciej Cisowski"),
  turtle: p(18463829, "A young sea turtle swimming", "Laura Meinhardt"),
  ellaView: p(6140665, "A hiker looking over the green slopes around Ella", "Kajanan Selvaranjan"),
  coconut: p(16711948, "A king coconut with a straw on a table beside the surf", "A Vasan"),
  cinnamon: p(15486150, "Bundles of rolled cinnamon quills", "Alfredo Marco Pradil"),
  compress: p(6187421, "A warm herbal compress being applied during a treatment", "Tima Miroshnichenko"),
} as const;

export type PhotoKey = keyof typeof PHOTOS;

export function px(id: number, w: number, h?: number): string {
  const base = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
  return h ? `${base}&h=${h}&fit=crop` : base;
}
