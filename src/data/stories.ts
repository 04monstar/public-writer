import type { Story, StoryBlock, StoryMeta } from '@/types/story';
import { makeArt, ornamentSvg, type Motif } from '@/utils/art';

const img = (motif: Motif, hue: number, seed: number) => makeArt({ hue, motif, seed });

interface Draft {
  meta: Omit<StoryMeta, 'coverHue' | 'coverArt'> & { coverHue: number; coverArt: null };
  blocks: StoryBlock[];
}

const novelBlocks: StoryBlock[] = [
  {
    kind: `chapter`,
    id: `ch1`,
    number: 1,
    title: `The Window That Remembers`,
    epigraph: `To draw a thing is to promise it a future.`,
    epigraphAuthor: `Attributed to M. Vessel`,
  },
  {
    kind: `paragraph`,
    id: `p1-1`,
    text: `Elara first saw the city through the window of a tram that was not on any timetable she knew. It was raining — a thin, patient rain that silvered the rooftops — and the tram, instead of curving toward the harbor as it always did, turned north along a street she had never once noticed, lined with houses whose gables leaned toward one another like old men sharing a secret.`,
    dropCap: true,
  },
  {
    kind: `paragraph`,
    id: `p1-2`,
    text: `She pressed her palm against the glass and felt a coldness that had nothing to do with the weather. The buildings were made of glass, or at least they gave the impression of it — walls that caught the lamplight and held it, translucent as the underside of a wave. And in every window, she understood with a certainty she could not explain, there was a map of the room behind it, drawn in silver ink upon the pane.`,
  },
  {
    kind: `paragraph`,
    id: `p1-3`,
    text: `When the tram reached the terminus she climbed down onto a platform of worn marble and stood, dripping, while the doors sighed shut behind her. The map-seller's stall at the end of the platform displayed a dozen atlases under glass, their spines worn to soft velvet by a century of thumbs. She bought one without reading the title, because the title was written in a language of compass roses and hachures, and because the seller, when he handed it over, said the thing she had feared all along.`,
  },
  {
    kind: `quote`,
    id: `p1-q`,
    text: `You will be needing it, miss. Every map is a promise, and promises wear out from the inside.`,
    author: `The map-seller`,
  },
  {
    kind: `paragraph`,
    id: `p1-4`,
    text: `That night, in her rented room above the printers' quarter, Elara opened the atlas and found, instead of pages, a mirror in which the city she had seen from the tram was arranged in perfect miniature, its glass streets glowing faintly green, its tiny citizens moving with the patience of tidewater. She reached out to touch the smallest street, and her finger did not meet paper.`,
  },
  {
    kind: `paragraph`,
    id: `p1-5`,
    text: `It met glass. And through the glass, a voice — thin as a drafting pencil — asked her, with great politeness, whether she had come to be mapped, or to map.`,
  },
  {
    kind: `chapter`,
    id: `ch2`,
    number: 2,
    title: `The Inks of Autumn`,
  },
  {
    kind: `paragraph`,
    id: `p2-1`,
    text: `She began to map it. The task, it turned out, was less like drawing and more like listening. Each morning the atlas would present her a page of blank, faintly luminous paper, and each morning she would sit at her narrow desk with a pen of polished brass and wait for the city to tell her what it remembered. Ink the color of tarnished copper came first — the roofs. Then a green like the underside of willow leaves — the canals. And then, at last, when the autumn light had grown long and amber, the ink of the citizens themselves: a deep, quiet blue, like the last minute before sleep.`,
  },
  {
    kind: `paragraph`,
    id: `p2-2`,
    text: `It was exacting work. A single misplaced line, and the city would simply refuse to appear there the following morning — a house would be gone, or a bridge would cross to a bank that had moved a hand's breadth westward. Elara learned to erase with her breath, rubbing the ink away in slow spirals the way her grandmother had cleaned a stained map of the old country, until the paper was pale again and patient.`,
  },
  {
    kind: `poem`,
    id: `p2-poem`,
    title: `Marginalia`,
    stanzas: [
      [`The compass knows no pity,`, `its needle is a lonely thing,`, `and every street I render`, `is a vow I could not keep.`],
      [`But autumn is a draftsman,`, `it inks the leaves with care,`, `and the map of what is leaving`, `is the fairest of them all.`],
    ],
  },
  {
    kind: `paragraph`,
    id: `p2-3`,
    text: `In the evenings she walked the real city — the one with cobbles and lamplight and the smell of coal smoke — and felt it differently now. She noticed the way a window would hold the last of the daylight, or the way a doorway's worn step suggested the exact weight of a hundred thousand goodbyes. The atlas had taught her to read the world as a manuscript, and now the manuscript would not stop reading her back.`,
  },
  {
    kind: `paragraph`,
    id: `p2-4`,
    text: `One Tuesday, in the second week of October, she turned a page of the atlas and found her own street — the rented room, the printers' quarter, the tram platform — already drawn in a hand she did not recognize. The ink was the deep, quiet blue of the citizens. The ink was hers.`,
  },
  {
    kind: `chapter`,
    id: `ch3`,
    number: 3,
    title: `The Compass in the Attic`,
  },
  {
    kind: `paragraph`,
    id: `p3-1`,
    text: `The attic of the printers' building had been locked for as long as anyone could remember, which in that quarter was a very long time indeed. The key lived on a hook behind the foreman's desk, and the foreman, a man named Corval who spoke almost entirely in the imperative, had forbidden Elara to take it. She took it anyway, at four in the afternoon, when the presses were thundering and Corval was bent over a forme of type as tall as a child.`,
  },
  {
    kind: `paragraph`,
    id: `p3-2`,
    text: `The attic smelled of dust and old glue and the particular sweetness of paper left to age in the dark. Against the far wall, wrapped in oilcloth, stood a compass as tall as a man, its arms of tarnished brass, its bowl filled not with a needle but with a pool of liquid silver that trembled when she approached. A brass plate beneath it was engraved with a single sentence, worn soft at the edges: The instrument does not point north. It points home.`,
  },
  {
    kind: `paragraph`,
    id: `p3-3`,
    text: `Elara set her atlas upon the compass's table and opened it to the page of her own street. The silver in the bowl swirled once, twice, and then resolved into a needle — a needle that pointed, with terrible certainty, at the exact center of the drawing she had not made. At the room in which she stood. At her.`,
  },
  {
    kind: `quote`,
    id: `p3-q`,
    text: `Every map has a center, miss, and the center is always the one holding the pen.`,
    author: `Corval the foreman`,
  },
  {
    kind: `paragraph`,
    id: `p3-4`,
    text: `She descended the attic stairs in a kind of trance, the compass's needle still turning slowly in her mind like the hand of a clock that had been wound too far. In the weeks that followed she mapped the city of glass with a devotion that frightened her, filling page after page, and always — always — the blue ink of the citizens found its way into the margins, waiting to be noticed, waiting to be read.`,
  },
  {
    kind: `chapter`,
    id: `ch4`,
    number: 4,
    title: `A Street Called Otherwise`,
  },
  {
    kind: `paragraph`,
    id: `p4-1`,
    text: `On the first day of December the atlas gave her a street that was not in any city she had ever drawn or dreamed. It ran north from the harbor in a gentle arc, crossing the canals at odd angles, and its name, in the careful copperplate of the map-maker's hand, was written simply: Otherwise. She left the tram at a stop she had never seen before and walked it end to end, past glass houses and paper lanterns, past a bakery that sold bread shaped like small boats, past a bookshop whose window displayed a single volume: a map of a city, open to a street called Otherwise.`,
  },
  {
    kind: `paragraph`,
    id: `p4-2`,
    text: `The bookshop door was unlocked. Inside, behind the counter, sat the map-seller from the platform, older than she remembered and younger than she feared, turning a brass compass over in his hands. He looked up when she entered and smiled the way people smile at a story they have told many times and are glad to see once more.`,
  },
  {
    kind: `paragraph`,
    id: `p4-3`,
    text: `Took you long enough, he said. The street only appears in December, you know. It's a seasonal thing. He set the compass on the counter. I kept it for you. The needle, when she picked it up, was already pointing down the length of Otherwise, toward a door at the end of the street that had not been there a moment before.`,
  },
  {
    kind: `chapter`,
    id: `ch5`,
    number: 5,
    title: `The Map Is the Territory`,
  },
  {
    kind: `paragraph`,
    id: `p5-1`,
    text: `She understood, standing on the threshold of the door at the end of Otherwise, what the compass and the atlas and the silver-ink voices had been trying to tell her all along. The city of glass was not a place she had discovered. It was a place that had been waiting for her to finish drawing it — a draft, a working proof, a map of a life she had not yet lived. The door was not an exit. It was the last line of the map, the one that closes the page.`,
  },
  {
    kind: `paragraph`,
    id: `p5-2`,
    text: `She opened it, and stepped through, and the map of the city of glass closed behind her like the cover of a book, its spine gleaming with the fine gold of a promise kept. In the room above the printers' quarter, the atlas lay open on the desk, and for the first time in three months its pages were blank, and patient, and full of the light of a quiet morning.`,
  },
  {
    kind: `paragraph`,
    id: `p5-3`,
    text: `She sat down, took up the polished brass pen, and began, very carefully, to listen for the next city.`,
  },
];

const poemBlocks: StoryBlock[] = [
  {
    kind: `chapter`,
    id: `poem-ch1`,
    number: 1,
    title: `Orchard`,
  },
  {
    kind: `poem`,
    id: `poem-1`,
    stanzas: [
      [`Evening leans its long arm on the orchard wall,`, `and the apples, too heavy for their branches,`, `are small lanterns going out.`, `I have come here to count what remains:`],
      [`the last bee, drunk on fallen fruit,`, `the wasp's amber cathedral`, `gone to paper in the eaves,`, `the gate that remembers the weight of your hand.`],
    ],
  },
  {
    kind: `separator`,
    id: `sep-1`,
  },
  {
    kind: `poem`,
    id: `poem-2`,
    title: `Nets`,
    stanzas: [
      [`All evening the wind has been mending its nets,`, `tossing them over the hedge,`, `gathering the light that falls`, `where the plum trees stand in their blue shadows.`],
      [`I was taught that grief is a season`, `and will pass, as the russet passes`, `from the pear, as the swallow's stroke`, `fades from the pond at dusk.`],
      [`But the wind mends its nets patiently,`, `and I am learning the patience of the wind:`, `to hold, to wait, to let the orchard`, `keep its own score.`],
    ],
  },
  {
    kind: `quote`,
    id: `poem-q`,
    text: `The garden is a letter the earth writes to itself.`,
    author: `From the notebooks`,
  },
  {
    kind: `poem`,
    id: `poem-3`,
    title: `The Ripe and the Falling`,
    stanzas: [
      [`Somewhere a ladder leans in the grass`, `and the apples keep their counsel.`, `Somewhere a hand is lifted, and the light`, `splits like a peach on the sill.`],
      [`I have no seasons left to barter`, `with the long arithmetic of trees;`, `I am the ripe and the falling,`, `the basket and the bruise.`],
    ],
  },
  {
    kind: `chapter`,
    id: `poem-ch2`,
    number: 2,
    title: `Tide`,
  },
  {
    kind: `poem`,
    id: `poem-4`,
    stanzas: [
      [`The tide goes out with the bread of the moon,`, `and the salt is a language`, `only the dunes still speak.`, `I write your name in the wet sand`],
      [`and the sea, being kind,`, `takes it as dictation`, `and files it away`, `among its other unfinished letters.`],
    ],
  },
  {
    kind: `poem`,
    id: `poem-5`,
    title: `The Boat Builder`,
    stanzas: [
      [`He has planed a hundred hulls`, `and never once set sail;`, `the sea is a rumor`, `he keeps in his workshop.`],
      [`His hands are the color of varnish`, `and his eyes, when they find the horizon,`, `are the color of rope,`, `which is to say: strong, and beginning to fray.`],
      [`I asked him once what the boat is for.`, `He laid his palm along the gunwale`, `and the wood remembered water,`, `and the workshop filled with the sound of it.`],
    ],
  },
  {
    kind: `separator`,
    id: `sep-2`,
    variant: `flourish`,
  },
  {
    kind: `poem`,
    id: `poem-6`,
    title: `What the River Keeps`,
    stanzas: [
      [`The river keeps what the rain forgets: keys,`, `and the cold arithmetic of stones,`, `and the paper boats we launched`, `on the faith of a Sunday afternoon.`],
      [`It gives them back, eventually,`, `worn to a finer currency —`, `a leaf where a letter was,`, `a glint where a promise was.`],
      [`I stand at the bridge and practice`, `the river's accounting:`, `to receive, to hold, to return,`, `to be changed by the keeping.`],
    ],
  },
];

const childrenBlocks: StoryBlock[] = [
  {
    kind: `chapter`,
    id: `kids-ch1`,
    number: 1,
    title: `Milo Finds a Paper Moon`,
  },
  {
    kind: `paragraph`,
    id: `kids-p1`,
    text: `In a little house at the end of a crooked street, there lived a boy named Milo who collected the things other people dropped. A button with no coat. A key with no lock. A feather with no bird to wear it.`,
    dropCap: true,
  },
  {
    kind: `image`,
    id: `kids-img1`,
    src: img(`celestial`, 210, 11),
    alt: `Milo reaching up toward a paper moon in a blue night`,
    caption: `The night Milo caught the moon`,
    aspect: 0.75,
  },
  {
    kind: `paragraph`,
    id: `kids-p2`,
    text: `One night, a paper moon fell out of the sky and landed right in his garden, knocking the hat off the garden gnome and folding itself into the rose bush with a sound like a whispered secret.`,
  },
  {
    kind: `paragraph`,
    id: `kids-p3`,
    text: `Milo picked it up very carefully, because paper moons are lighter than they look, and they tear if you hurry. It was warm, and it smelled of chalk and faraway places, and when he held it up to his ear he could hear the ocean saying its prayers.`,
  },
  {
    kind: `separator`,
    id: `kids-sep1`,
    variant: `asterism`,
  },
  {
    kind: `paragraph`,
    id: `kids-p4`,
    text: `The paper moon needed to go home, the garden gnome said, though the gnome said it with his back turned, because gnomes do not like to admit they have been listening all night.`,
  },
  {
    kind: `quote`,
    id: `kids-q1`,
    text: `You cannot post a moon. You must carry it, and you must be quiet, because quiet things travel furthest.`,
    author: `The garden gnome`,
  },
  {
    kind: `paragraph`,
    id: `kids-p5`,
    text: `So Milo packed a biscuit and a blanket and the map of all the places his shoes had ever been, and he set off with the paper moon wrapped in his jumper, following the silver thread that every falling star leaves behind.`,
  },
  {
    kind: `image`,
    id: `kids-img2`,
    src: img(`forest`, 150, 21),
    alt: `Milo walking through a dark forest carrying a glowing paper moon`,
    caption: `Through the listening forest`,
    aspect: 0.75,
  },
  {
    kind: `paragraph`,
    id: `kids-p6`,
    text: `The forest was very quiet. The trees leaned in to look at the moon, and their leaves whispered Pass it on, pass it on, and Milo began to understand that a light is only heavy when you carry it alone.`,
  },
  {
    kind: `paragraph`,
    id: `kids-p7`,
    text: `When at last he reached the top of the hill, the sky was a dark blue blanket with a hole where the moon used to be. Milo lifted the paper moon over his head, and the paper moon grew warm and round and silver, and it floated up and up until it clicked into place like a button finding its coat.`,
  },
  {
    kind: `paragraph`,
    id: `kids-p8`,
    text: `And from that night on, when Milo looked up at the sky, he knew the moon by its one tiny crease — the crease from his jumper, the fold from his hands, the little home that every light keeps inside it for the person who carried it home.`,
  },
];

const letterBlocks: StoryBlock[] = [
  {
    kind: `chapter`,
    id: `let-ch1`,
    number: 1,
    title: `First Leaves`,
  },
  {
    kind: `letter`,
    id: `let-1`,
    salutation: `My dearest Irina,`,
    paragraphs: [
      `The season has turned the bay to the color of hammered tin, and the lighthouse keeper has stopped painting his boat, which means he has given up on summer and is preparing for the long grammar of winter. I think of you in the city, among its bright machinery, and I wonder whether the light there has any patience in it, or whether it is all demand.`,
      `I have taken to walking the headland at dusk. The gulls arrange themselves along the breakwater like a sentence waiting for its verb, and the fog, when it comes, arrives the way your letters do — gradually, then all at once. I keep them in the tin box on the shelf, arranged by month, though I confess I sometimes read them by the compass of mood rather than date.`,
      `The herring have returned early. Old Mr. Vane says it is a sign of a mild winter; old Mrs. Vane says it is a sign of the end of the world. They are both, I suspect, describing the same weather.`,
    ],
    closing: `Yours, across the water,`,
    signature: `Tomas`,
  },
  {
    kind: `letter`,
    id: `let-2`,
    salutation: `Dearest Tomas,`,
    paragraphs: [
      `Your letter arrived on a day of improbable sunshine, and I read it twice on the tram, once for the words and once for the way they sat on the paper, which is a different kind of reading and the only kind I trust.`,
      `The city is full of lights that mean nothing, and I have grown expert at telling them apart from the ones that mean something. Yours, I have decided, are the ones that flicker. The city does not understand flickering. It considers it a malfunction. I consider it a pulse.`,
      `Come for the equinox. The light here has the patience you spoke of — I have watched it sit on the same wall for hours, doing nothing, asking nothing. It will teach you the grammar of winter better than I can, though I will try my best to be a good lesson.`,
    ],
    closing: `With all my arithmetic,`,
    signature: `Irina`,
  },
  {
    kind: `letter`,
    id: `let-3`,
    salutation: `My dearest Irina,`,
    paragraphs: [
      `The equinox light arrived exactly on schedule and I was not ready for it, which I believe is the definition of a season. I stood at the end of the jetty with the harbor master's telescope and tried to see as far as your window. The sea was doing its trick of looking flat and being anything but.`,
      `Mr. Vane has been vindicated, at least partially: the winter is mild, and the end of the world has been postponed until further notice. We will take what we are given.`,
      `I have written your name on the boat, in the place where the paint was worn through. It is a small, private renaming. The gulls have not objected.`,
    ],
    closing: `Yours, across the water,`,
    signature: `Tomas`,
  },
];

const essayBlocks: StoryBlock[] = [
  {
    kind: `chapter`,
    id: `es-ch1`,
    number: 1,
    title: `On the Architecture of Silence`,
    epigraph: `Noise is the sound of other people's houses. Silence is the blueprint of one's own.`,
  },
  {
    kind: `paragraph`,
    id: `es-p1`,
    text: `We build our rooms, and then we build the silences to fill them. The two undertakings are inseparable, though only one is ever drawn to scale. A room's true dimensions cannot be read from its floor plan; they are measured in the time it takes a dropped key to be heard, or the distance a whisper travels before it becomes a murmur, or the exact number of steps the light takes from the window to the far wall on a winter afternoon.`,
    dropCap: true,
  },
  {
    kind: `heading`,
    id: `es-h1`,
    level: 2,
    text: `The Load-Bearing Quiet`,
  },
  {
    kind: `paragraph`,
    id: `es-p2`,
    text: `Some silences support the structure of a life. They are the joists and lintels of the domestic world, and when they are removed the walls do not fall immediately — they bow, and then they complain, and then, one ordinary Tuesday, they give way. I am thinking of the silence of a house at noon, when the clocks have been wound and the mail has not yet come; of the silence of a library after closing, when the books settle into their opinions; of the particular, load-bearing quiet that exists between two people who have agreed, without ever saying so, to keep each other's secrets.`,
  },
  {
    kind: `list`,
    id: `es-list1`,
    ordered: true,
    items: [
      `Identify the load-bearing silences in your own rooms.`,
      `Distinguish them from the merely decorative ones.`,
      `If a silence is doing work, do not redecorate it.`,
      `Remember that every wall is a door in disguise.`,
    ],
  },
  {
    kind: `heading`,
    id: `es-h2`,
    level: 2,
    text: `A Short Table of Interiors`,
  },
  {
    kind: `table`,
    id: `es-table`,
    title: `Comparative Acoustics of Domestic Rooms`,
    headers: [`Room`, `Decay time`, `Governing silence`, `Best hour`],
    rows: [
      [`Kitchen`, `0.9 s`, `The kettle at a simmer`, `7 a.m.`],
      [`Library`, `1.8 s`, `Pages turning their own advice`, `3 p.m.`],
      [`Basement`, `2.4 s`, `The furnace's low sermon`, `Any`],
      [`Attic`, `1.2 s`, `Rain on the eaves, rehearsing`, `Dusk`],
      [`Corridor`, `0.4 s`, `The briefness of passing`, `Never`],
    ],
  },
  {
    kind: `paragraph`,
    id: `es-p3`,
    text: `The corridor deserves a note. It is the most honest room in any house because it is the only one built for leaving, and its silence is therefore a transitive silence, the silence of a sentence between subject and verb. Those of us who live in corridors — and I am convinced that certain temperaments are corridor dwellers by nature — learn to make our peace with the briefness, to treat every threshold as a caesura rather than a full stop.`,
  },
  {
    kind: `quote`,
    id: `es-q1`,
    text: `A room is a paragraph; a house is an argument; a home is a book you keep writing, badly, forever.`,
    author: `Essay on the Domestic Essay`,
  },
  {
    kind: `heading`,
    id: `es-h3`,
    level: 2,
    text: `The Renovation of Silence`,
  },
  {
    kind: `paragraph`,
    id: `es-p4`,
    text: `We are forever renovating our silences. We install new ones over old ones — a television over a fireplace, an argument over a silence that was working perfectly well. The older silences, the load-bearing ones, do not disappear; they go on holding the house up from beneath the drywall of our distractions, patient as foundations. I have learned to listen for them the way a mason listens for the settling of a wall: by putting my ear to the structure and trusting what does not creak.`,
  },
  {
    kind: `separator`,
    id: `es-sep`,
    variant: `flourish`,
  },
  {
    kind: `paragraph`,
    id: `es-p5`,
    text: `In the end, the architecture of silence is simply the architecture of attention, drawn in reverse. We do not design silences; we reveal them, the way a careful builder reveals the timber beneath the plaster. The quiet rooms are not the empty rooms. They are the ones where the most is happening, at the slowest possible speed, and where the only thing ever truly measured is the distance a voice will travel when it finally decides to speak.`,
  },
];

const storyDrafts: Record<string, Draft> = {
  "the-cartographer-of-glass": {
    meta: {
      id: `the-cartographer-of-glass`,
      slug: `the-cartographer-of-glass`,
      title: `The Cartographer of Glass`,
      subtitle: `A novel in five chapters`,
      author: `Helena Voss`,
      publisher: `Halcyon House`,
      edition: `First Edition`,
      year: 2024,
      description:
        `Elara maps a city that appears only in dreams — a city of glass streets and silver ink, where every map is a promise and every promise wears out from the inside.`,
      type: `novel`,
      genre: `Literary fiction`,
      coverHue: 205,
      coverArt: null,
      chapters: [
        { id: `ch1`, number: 1, title: `The Window That Remembers` },
        { id: `ch2`, number: 2, title: `The Inks of Autumn` },
        { id: `ch3`, number: 3, title: `The Compass in the Attic` },
        { id: `ch4`, number: 4, title: `A Street Called Otherwise` },
        { id: `ch5`, number: 5, title: `The Map Is the Territory` },
      ],
      readingSpeed: 240,
    },
    blocks: novelBlocks,
  },
  "evening-in-the-orchard": {
    meta: {
      id: `evening-in-the-orchard`,
      slug: `evening-in-the-orchard`,
      title: `Evening in the Orchard`,
      subtitle: `Poems and marginalia`,
      author: `Clara Marsh`,
      publisher: `Marrow Press`,
      edition: `Limited Edition`,
      year: 2025,
      description:
        `A poetry collection of orchards, tides and boat builders — verse that keeps its own score.`,
      type: `poem`,
      genre: `Poetry`,
      coverHue: 140,
      coverArt: null,
      chapters: [
        { id: `poem-ch1`, number: 1, title: `Orchard` },
        { id: `poem-ch2`, number: 2, title: `Tide` },
      ],
      readingSpeed: 180,
    },
    blocks: poemBlocks,
  },
  "milo-and-the-paper-moon": {
    meta: {
      id: `milo-and-the-paper-moon`,
      slug: `milo-and-the-paper-moon`,
      title: `Milo and the Paper Moon`,
      subtitle: `An illustrated story for the young and the quietly stubborn`,
      author: `Ana Bell`,
      publisher: `Little Oak Books`,
      edition: `Board Edition`,
      year: 2025,
      description:
        `A boy who collects lost things finds a paper moon that fell from the sky — and learns that a light is only heavy when you carry it alone.`,
      type: `children`,
      genre: "Children's",
      coverHue: 210,
      coverArt: null,
      chapters: [
        { id: `kids-ch1`, number: 1, title: `Milo Finds a Paper Moon` },
      ],
      readingSpeed: 160,
    },
    blocks: childrenBlocks,
  },
  "letters-from-the-coast": {
    meta: {
      id: `letters-from-the-coast`,
      slug: `letters-from-the-coast`,
      title: `Letters from the Coast`,
      subtitle: `A correspondence in three seasons`,
      author: `Tomas & Irina`,
      publisher: `Sundial Press`,
      edition: `Collected Edition`,
      year: 2023,
      description:
        `Two correspondents trade letters across a bay — about light, patience, boats, and the arithmetic of absence.`,
      type: `letter`,
      genre: `Epistolary`,
      coverHue: 26,
      coverArt: null,
      chapters: [
        { id: `let-ch1`, number: 1, title: `First Leaves` },
      ],
      readingSpeed: 220,
    },
    blocks: letterBlocks,
  },
  "on-the-architecture-of-silence": {
    meta: {
      id: `on-the-architecture-of-silence`,
      slug: `on-the-architecture-of-silence`,
      title: `On the Architecture of Silence`,
      subtitle: `Essays on rooms and the things that hold them up`,
      author: `Julian Atherton`,
      publisher: `Meridian Review`,
      edition: `Second Edition`,
      year: 2024,
      description:
        `An essayist dissects the load-bearing silences of domestic life, complete with tables, lists and a short comparative acoustics appendix.`,
      type: `essay`,
      genre: `Essays`,
      coverHue: 32,
      coverArt: null,
      chapters: [
        { id: `es-ch1`, number: 1, title: `On the Architecture of Silence` },
      ],
      readingSpeed: 200,
    },
    blocks: essayBlocks,
  },
  "the-house-beneath-rain": {
    meta: {
      id: "the-house-beneath-rain",
      slug: "the-house-beneath-rain",
      title: "The House Beneath Rain",
      subtitle: "Premium Collector Edition",
      author: "Eleanor Ash",
      publisher: "Northlight Press",
      edition: "First Edition",
      year: 2021,
      description: "A premium mock story used for testing the hardcover reader experience.",
      type: "novel",
      genre: "Literary Fiction",
      coverHue: 17,
      coverArt: null,
      chapters: [
        { id: "ch1", number: 1, title: "Beginning" },
        { id: "ch2", number: 2, title: "Conflict" },
        { id: "ch3", number: 3, title: "Resolution" }
      ],
      readingSpeed: 220
    },
    blocks: novelBlocks
  },
  "winter-birds-remember": {
    meta: {
      id: "winter-birds-remember",
      slug: "winter-birds-remember",
      title: "Winter Birds Remember",
      subtitle: "Premium Collector Edition",
      author: "Mara Ellis",
      publisher: "Halcyon House",
      edition: "First Edition",
      year: 2022,
      description: "A premium mock story used for testing the hardcover reader experience.",
      type: "novel",
      genre: "Literary Fiction",
      coverHue: 34,
      coverArt: null,
      chapters: [
        { id: "ch1", number: 1, title: "Beginning" },
        { id: "ch2", number: 2, title: "Conflict" },
        { id: "ch3", number: 3, title: "Resolution" }
      ],
      readingSpeed: 220
    },
    blocks: novelBlocks
  },

};

const fillerChapters = [
  {
    title: `The Cartographers' Lesson`,
    text: [
      `The old cartographers kept three inks and one rule: never draw a road you would not walk. It seemed a modest law, easily kept, until the day the city of glass offered me a street that led nowhere I had been and everywhere I had avoided. I inked it anyway, and the ink sang.`,
      `A map is a kind of memory with the chronology removed. It does not tell you what happened, only what lies beside what, and in that lateral honesty I found a comfort I had not expected. The city forgave my crooked lines the way a river forgives its banks.`,
    ],
  },
  {
    title: `The Printer's Proof`,
    text: [
      `Corval ran a proof of my newest page and held it up to the lamplight, squinting at the hachures as though they might confess something. "Fine work," he said at last, which from Corval was a paragraph. "You have the hands for it. The question is whether you have the patience to let the ink dry."`,
      `I have come to believe that patience is not the absence of motion but its highest form — the slow turning of the earth that makes the shadows walk, the long settling of a foundation that makes the house a home.`,
    ],
  },
  {
    title: `The Glassblower's Map`,
    text: [
      `In the glassblower's quarter, the furnaces glow like low suns and the workers move with the unhurried grace of men who have learned that glass cannot be hurried. She asked me what I drew, and when I told her, she laughed and said the city was not glass at all — it was blown glass, which is to say it was still cooling, still deciding its final shape.`,
      `That was the kindest thing anyone had ever said about my work: that it was not finished, only warm.`,
    ],
  },
];

/** Generate a long-form edition with many chapters to exercise virtualization. */
function longNovel(): Draft {
  const base = storyDrafts[`the-cartographer-of-glass`]!;
  const blocks: StoryBlock[] = [...novelBlocks];
  let chapter = 6;
  let counter = 100;
  const extra = 130;
  for (let i = 0; i < extra; i++) {
    const template = fillerChapters[i % fillerChapters.length]!;
    blocks.push({
      kind: `chapter`,
      id: `long-ch-${i}`,
      number: chapter,
      title: template.title,
    });
    for (const para of template.text) {
      blocks.push({
        kind: `paragraph`,
        id: `long-p-${counter++}`,
        text: para,
      });
    }
    if (i % 4 === 1) {
      blocks.push({
        kind: `quote`,
        id: `long-q-${i}`,
        text: `Every map is a promise, and promises wear out from the inside.`,
        author: `The map-seller`,
      });
    }
    if (i % 6 === 3) {
      blocks.push({
        kind: `image`,
        id: `long-img-${i}`,
        src: img(`celestial`, 205 + (i % 5) * 8, 7 + i),
        alt: `A detail from the atlas of glass`,
        caption: `From the private atlas, plate the like of which does not exist`,
        aspect: 1.5,
      });
    }
    chapter++;
  }
  return {
    meta: {
      ...base.meta,
      id: `the-atlas-of-endless-pages`,
      slug: `the-atlas-of-endless-pages`,
      title: `The Atlas of Endless Pages`,
      subtitle: `A complete edition, set in type`,
      description:
        `A single long novel rendered across hundreds of pages, designed to showcase full virtualization at extreme length.`,
      edition: `Complete Edition`,
      coverHue: 265,
      chapters: Array.from({ length: extra + 5 }, (_, i) => ({
        id: `ch-${i + 1}`,
        number: i + 1,
        title: i < 5 ? base.meta.chapters[i]!.title : fillerChapters[i % fillerChapters.length]!.title,
      })),
    },
    blocks,
  };
}

const drafts: Record<string, Draft> = {
  ...storyDrafts,
  "the-atlas-of-endless-pages": longNovel(),
};

export const ALL_STORIES: Story[] = Object.values(drafts).map((d) => ({
  id: d.meta.id,
  meta: {
    ...d.meta,
    coverArt: null,
    coverHue: d.meta.coverHue,
  },
  blocks: d.blocks,
}));

export const storyById = (id: string): Story | undefined => ALL_STORIES.find((s) => s.id === id);

export const coverOrnament = (hue: number, light = 62, size = 80) => ornamentSvg(hue, light, size);
