// Bonus words for Busy Bee: real words that are accepted and cheered but
// don't get a clue card, so a kid who finds a valid word is never told no.
// Built from words that are in both the ENABLE word list and the 50k most
// common English words (FrequencyWords), minus a bad-words list and a
// hand-picked grown-up list. Only 3-8 letter words with at most 5 different
// letters are kept (anything else can never fit a hive). DICTIONARY words
// are left out since they are already answers. To block a word, delete it here.
const BONUS = `
aah aardvark aargh aba aback abacus abandon abate abba abbas abbess abbey abbot abed abhor abide
abigail ablaze aboard abode abs abscess absorb absorbs abuse abuses abut abyss acacia acclaim
accord accuse accuses aced aces ache ached aches achoo achy acidic acme acorn acreage acted actin
adage adamant adapt adder addict adept adhere adhered adieu adios ado adore adored adorn ads adult
aegis aether afar aff affable affirm afghan afire aflame afloat afoot afore aft aga ageing ageless
aggie aggro agha agile agitate aglow agony agora agrarian aha ahem ahold ahoy aide aided aides
aiding aids ailing ails aiming ain aired airfare airing airman airs airway airy aisle aisles ajar
akin ala alack alameda alamo alamos alan alarms alas alaska alba alcazar alcohol alder ale alec
alfa alfalfa algae aliases alibi alibis aligning aline alleges alleluia alley alleys alleyway
allies allot alloys alls allure ally alma almanac alms aloe aloft aloha aloof aloud alpaca alphas
alps als alt altar altars althea alum alway ama amass amassed amaze amazed amazes amazon ambo amen
ami amid amiga amigo amin amir amis amiss ammo ammonia amoeba amok amoral amour amp ample amply
amps amrita amuse amuses ana anaconda anagram analog ands ane anemia anemone anew angina angling
angst ani anil anise ankle anna annals annas annexed annoy annoys annul anoint anon ante anteater
antennae antennas ants antsy anvil anyways aorta apache apathy apes apex aphasia apiece apnea
apollo appalled appealed appease appeased appetite applaud apples apron apropos apt aptly arabic
arcadia arcane archaic archer ardor arenas ares arf argon argus aria arias arid ariel arises ark
armada armory armour aroma arose arras arrears arrests arrows arroyo arse arses arson art artery
artsy arty arugula arvo ascot ashes ashram asinine askew asleep aspen assassin assault assaults
assent assert assessor assuage assures aster astral astray astute athlete atoll atoms atone atop
att attaboy attache attain attest attic attire attracts aught augur auld aunt aunts aunty aura ava
avail avant avast avatar avatars ave avenge aver averse avert avian avid avocado awa await awaits
awake awaken awakes awash awe awed awkward awning awoke awol awry axed axel axes axle aye azalea
azaleas azure baa baal baba babbitt babble babbles babe babel babes baboon baboons babu baccarat
bach backpack backs badass bade bagel baggage bagged bagger baggie bagging baggy bagman bah baht
bail bailiff bairn bait bake baked bakes baklava bal balboa baldy bale bales ballad ballads ballast
balled baller balls ballsy bally balm balmy bam bamboo bamboos ban banal bananas banco bandana
banded bandy bane banging bangs banjo banning bans banyan banzai bap barb barbaric barbed barber
barbers barbs bard bared barf barge bark barker barks barman barmy barns baron barrack barrage
barred barren barret barrio barroom barrow barter bas basal basalt baseless bash basil basins bask
basset bassett bassist bassoon bast baste bates bathe bathtub batman baton bats batted batten
batter batty bauble bawdy bawl bayard bayou bays bazaar bazooka bead beady beagle beak beaker beaks
beamed beams beanbag beanie bearable beard bearded bearer bearers beasts beaten beater beau beaut
bebop beck becket becks bedded bedside beech beefs beefy beehive beeline beep beeped beeper beeps
beer beers bees beet beetle beetles beetroot beets befall befell begat beget begets beggar begged
begging begone begs begum behave behead beheaded beheld behest beige bel belay belch belittle
belive bellboy belles bellies bellow bells belted belter ben bended bender bends bendy bene benign
bennet benny benzene berate bereft beret berets beretta berg berm berries berserk berth beryl
beseech beset bested bet betel beth bethel betide bets betters bevy beware bey bible bibles
biblical bicarb biddy bide bidet biding bier biff biggie bigot bigwig bigwigs bijou biker biking
bikini bikinis bilbo bile bilge bill billed billet billie billy bin binds binge bins bio bionic
birch birdie birk bis bison biter bites biting bitsy bitten bitter bitty biz blab blabbed blabber
blah blam bland blare blasts blatant blaze bleak bleat bled bleed bleeder bleeds bleep bleeps
blended blesses blew blimp blip blips bliss blitz bloat blob blobs bloc bloke blond blooded bloods
blooms bloop blossom blossoms blot blown blows blubber bluebell bluer bluey bluff bluffs blume
blunt blur blurry blurt blush boa boar boars boast boasts bob bobbing bobble bobby bobcat bobs
boche bock bod bode boffin bog bogey bogged boggle bogie bogs bogus boil boils boing boldly bolero
bolo bolts bolus bomb bombed bomber bombs bonanza bonbon bonbons bonded boned boney bongo bongos
boning bonito bonk bonne bonnet bonnie bonny bony boo booed booger boogey boogie booing booked
booker bookie boomer booms boon boor boos boosts booted booths bop bora bore bores borne borrow
borrower borrows bos bosh bosom bosoms boson bossed bosses bossy boston bosun bot botch bots
bottoms bough bourbon bout bouts bowed bowel bower bowls bows boxer boyar boycott boyhood boyo bozo
bozos bra brace brad brag braggart brags brahma braid bran brant bras brash brat brats brava braver
bravo brawl brawn bray breaker bream bred bree breech breeder breeders breeze breezes breezy bren
brent brew brewed brewer brewers brewery brews briar bribe bribed bribery bribes bribing brie brig
brill brim brimmer brine brink briny bris brisk brit brits britt bro brock bronc bronco brooch
brood broom brooms bros broth brow brows brr brrr brumby brunt brute bryony bub bubbles bubbly
bubby bubs bucko bud budge buds buff buffet buffoon buffs buffy bugged bugging buggy bugle bulb
bulbs bulge bulky bulls bully bum bumble bummed bummer bump bumps bumpy bums bung bungee bunion
bunk bunks buns bunt buoy buoys bur burble burbs burg burger burly burnt burp burps burr burro
burrow bursar bursts bury busboy busby bushes bushy busses butch buts butte buyout buzzed buzzer
buzzes bwana bypass cabal cabana cabbage cabbie cabby cabs caca cackle cacti cactus cad caddie
caddy cade cadence cadet cadre caesar caesars cafe cafes caged cages cagey caiman cain cairn caked
calculus calf calico calla callas callback caller calmly calms cam cameo camorra campo cams canals
canary canasta cancan candid cane canes canine canned canning cannons cannot canny canoe canons
cans canst canteen cantina canto canton canvass caped caper capes capita capo capped caramba carat
carats caravan carb carbs carcass cared carefree carer cares caress caresses carina carl carnal
carny carol carp carpal carr carrot carte carter carts carve carver casa casbah cascade case cased
cask casks cassette cassock caste castes casts cataract catchy cate cater caterer cates catty
caucus caveat caved caves caviar caw caws cayenne cayman cease ceased ceases cede cee celeb celebs
celery celeste cellar cello celts centre cereal ceres ceviche chad chaff chakra chalk cham champ
chang chant chao chap chaps char chard chases chasm chats chatty checker cheek cheeks cheeky cheep
cheer cheered cheery cheeses cheesy cheetah chefs chemo chests chew chewed chews chewy chez chi
chia chic chichi chicks chico chide chili chill chilli chills chilly chime chimp chin chino chins
chip chippy chirp chit chitchat chitty chock choke cholo chomp chon chook chooses choosy chop
choppy chops chord chore chow chub chuck chucks chucky chug chum chummy chump chums chunk churn
chute ciao cicada cicadas cicely cicero cider cigar cinch circa cis cissy citing civics civvies
clack clacks clad clam clammy clamp clams clang clank clans clap claps claro clary clash clasp
classy clave claw claws clay clays clearer cleave cleft clench cleric clever cleverer cliche cliff
cliffs clinch cline cling clinging clink cloak clod clog clogs clop clot clots clout clove clown
cluck clucks clue clueless clues clump clung clunk clutch coals coasts coats coax cob cobb cobble
cobra cobweb coca cochin cockatoo coco cocoa coconut cocoon cocoons coddle coddled coded codex coed
coerce coerced coffees coffin cog cognac cogs coil coils coke cokes col cola coldly colds cole
coles colic colin colleen collie colonel colonic colossal colossus colour colt colts coma comas
comb combs comer comet comfy comma commence commie commode comp comte con concede conceded conch
concha concoct concord concur condo condone condor condos cone cones coney conga congee congo conk
conn conned conner conning conte convene convoy coo cooch cooing cooker cookout cooks cooled coolie
coolly cools coombs coop cooped coos coot cooter coped copped cops cor corby cordon cords cores
corks corky corns corny corolla corona coroner corral corridor corrie corroded cory cos cosmic
cosmos cossack cossacks cosy cots cotta couch cough coup coupe couscous coven covet cower cowl cows
cox coy coyote coz cozy crabby crabs crack cracker cracks cram cramp crane crank cranny crass crate
crater cravat crave craw crawl craze creak creamer crease creases credence credo creed creeks creel
creep creeper creepers creepier creeps creepy creme creole crepe crepes crept crevice crews crib
cribs crick cried crier cries crimp cris crises crisp crisps critic critter croak croc crock crocs
croft crone crook crooks croon crooner crore crores crosses crouch croup crow crows crud cruel
crumb crummy crump crunch crush crust crusts crutch crux crybaby crypt cubby cubes cubs cuckoo
cuddle cuddled cuddly cuddy cue cues cuff cuffed cuffs cull culled cully culpa cults cumin cunning
cupid cuppa cur curare curb curd cured cures curia curie curl curls curly curran curry curse curses
curt curvy cushy cusp cuss cuter cutest cutie cutlet cutoff cutout cutter cutty cycled cynic cyst
cystic czar dab dabble dabbled dacha dada daddies dado dads daffy daft dag dagger dago dagwood dah
dahl dahlia dais daisies dal dale dales dally dames dammed damp dams danced dander dandy dang dank
dapper dared dares darker darn darned dart darts dashed dashes dato davy dawdle dawn dawned dawns
daze dazed dazzle dazzled dead deadbeat deader deadwood dean dearer dearie dears deary death deb
debated debit debs debts decaf decay decayed deceased decedent deceit deceive deceived decency
decides decked decker decks deco decode decoded decoder decor decoy decree decreed decrees deduce
deduced deduct deducted dee deed deeds deejay deem deems deepen deepened deepens deepest deets
defaced defame defamed defeated defect defected defended defender defends defenses defer defied
defies defile defiled deft defuse defused defy degas degrade degraded deign deities deity dejected
deke del deli dell delude deluded deluge delve demanded demean demented demise demo demon demos
demoted demure dengue denies denim denning denote dens denser dent dented dents depended depleted
depose deposed depress dere derive derry descend descends deserted deserter deserts deserved
deserves desires desist desks despise despised despises dessert desserts detects deter deterred
detest detested detox deuce deuces dev deva deviled devise devised devoid devon devote devotee dew
dewar dewy dex dexter dey dharma dhoti dialed dialled dials dib dibble dibs diced dicey dickie
diddle diddly dido didst die died dies diet dieter diets digger digging digits digs dike dill dilly
dim dime dimes dimmed dimmer dimming dimwit din dinar dine dined diner ding dinged dinging dingo
dings dingy dink dinky dint dioxide dipped dipper dipping dippy dips dire dirk dirtied dirtier dis
disco discos discus disdain diseased dismiss diss dissed dissing disused dit ditch ditto ditty diva
divas dived diver dives divides dividing divisive divvy diwan dixit dizzy djinn dobbin dobby dobie
dobson doc docked docks docs dodged dodger dodging dodgy dodo doe doer doge dogged doggie dogging
doggone doggy dogma doily dojo dol dolce dole dolled dollop dolly dolt dom domes dominion domino
don dona dong dongs donna donne dons donut doodle doodles doofus doomed doozy dor dorado dork dorks
dorky dorm dorms dory dos dosed doses doss dost dote doth dots dotted dotty dough dour douse doused
dove doves dow dowdy downed downs downwind downy dowry doze dozed dozer dozy drab dragged drags
drake dram dramas drank drape draped draper drat drawer dread dreaded dreads dreamed dreamer dreary
dredge dredged dregs dreidel dresser dressy drew drier dries drift drilled drills drip dripped
drips droll drone drool droop droopy drown druid druids drummed drummer dryers dub dubbed duce
duchy ducked ducks ducky duct ducts dud dude dudes duds due duel duels dues duet duets duff duffel
duffer duffle dugout dui duke dukes dull dulled duly duma dumas dumb dummy dumped dumps dumpy dun
dunce dune dunes dung dunk dunked dunning duo dupe duped duper duras duress durst dusk dusky dusted
dusty dutch duvet dwarf dweeb dwell dweller dwells dyad dye dyed dyer dyes eager earl earls earner
earns eased easel eases easiest eaten eater eaters eatery eats eau eaves ebb echoed echoes eclectic
eczema eddy edema edged edging edgy edible edict edifice edits eel eels eerie eerily eff effected
effendi effigy egad egged egghead egging eggnog eggshell eggy ego egos egress eighth einstein eject
ejected elated elbow elders eldest elevate elf elicit elites elitist elixir elk elks ell elm elms
elope eloped els elude eluded eludes elves ember embers emblem emcee emerge emerged emerges emery
emf eminence eminent emir emit emits emitted emitter emmet empress ems emu enact enamel encoded
encore ender endowed endure endured enema eng engages enroll ensign ensue ensued entice entreat
entree entrees envied envies envoy envy eons epoch epoxy equate equine equip era eras erase erased
eraser erasers erases ere ergo erica ermine ern erode eroded eros err errand errant erred ers erupt
escapee escapees escapes espresso ess esteem esteemed ester eta etcetera etch etched eth ether
ethic ethos eureka euro euros evade evaded evasive eve evenly evens evermore evert evict evilly
evils evoke evoked evokes evolve evolved evolves ewe exceeded exceeds excelled excels excesses
excise excite excuses exec execs exert exerted exes exhale exhume exile exiled exiles exited exits
expel expelled expend expended expire expo expose exposes extort exude eyeball eyeful eyeing eyelid
eyesore eyre fable facade facet fad fade faded fades fado faeces fain faint fairer fairs faked
faker fakes fakir falafel fallacy fallow famed familial fane fanfare fang fangs fanned fanning
fanny faraday faraway farce fared faro farrow fart farts fatally fated fates fats fatso fatten
fatter fattest faun fauna faux fave favela fawn fax faxed faxes fay fayed faze feared feast feasts
feats feces feck feds feeble feeder feeders feelers feign feigning feint feline fella fellas felled
feller fellers felon feminine femme femur fen fenced fences fend fender fennel fer feral fern ferns
ferret ferrets ferries fervor fess fester fet feta fetal fetch fete fetus fetuses feud feuds fevers
fey fez fiat fib fibbing fibre ficus fiddle fiddled fido fie fief fiend fierce fiery fife fifties
figs fil filet filial filler fillet fills filly filth finch fined finer fines finesse fink fins fir
firing firmer firs firsts firth fishes fishy fission fists fitch fitter fittest fiver fives fixer
fixing fixit fizz fizzing fizzle fizzy fjord flabby flack flail flair flak flake flaky flam flan
flank flannel flap flaps flare flask flasks flatfoot flatly flats flaw flaws flax flay flea fleas
fleck fled flee fleeced flees fleets flew flick flier flies fling flinging flint flips flirt flit
flock flog flooded floods flop flops flora floss flown flu flue fluff fluffy fluke flung flunk
flurry flute flyboy foal fob fodder foe foes foggy foil folded folds folly fon fond foodie fooled
fools footnote footy fop fora foray ford fore forego foresee forger forgo forks forlorn forme forte
forts foss fosse fossils fou fouls fours fowl foxes foxtrot foxy foy foyer fracas frag frail franc
frank frat fray freak freebie freed freer frees freezer freezers freezes frere fresher fret friar
friars fried fries frig frigging frigid frills frilly frisk frits frittata fritter fritz frizzy fro
frock froggy frogs frond froth frown froze fry fryer fuckup fudge fuehrer fueled fuelled fuels
fugue fuhrer fuji fulfil fulfill fulfills fuller fume fumes fungi fungus funnel furrow furry furs
fury fuse fused fuses fuss fusses fussy futon fuzz gab gabbing gabby gable gaby gad gadget gae gaff
gaffer gag gaga gage gagged gagging gaggle gags gaily gaining gait gal gala gale gales galilee gall
gallant galley gallon gallop gals gam gama gamer gammy gan ganged ganging gangland gangrene gangs
gangway ganja gap gape gaping gar garages garb gargle garner garret garter garth gas gases gash
gasp gasps gassed gasses gassing gassy gat gated gator gaudy gauges gault gaunt gauss gauze gavel
gawk gay gayer gays gaze gazed gazelle gazes gazing geared gears gecko ged gee geek geeks geeky
gees geese geez geezer geezers gel gemma gems gen gene geneva genie genies genii genoa gent genteel
gents genus germ germs geta getup geum geyser geysers ghee ghetto ghosts ghoul gib gibbon giddap
giddy gie gig giggle giggles giggling gigolo gigs gilded gill gillies gills gilly gilt gimme
gimmick gimp gimpy gin ginger ginny ginseng gipsy girlie girly giro girth gist git giver gizmo
glacial glade gladly gland glare glassy glaze gleam glean glee glen glib glide gliding glint glitz
gloat glob gloom gloomy gloss glossy glove glows glue glued glug gluing glum gnat gnaw gnawing goa
goad goanna goatee goats gob gobble gobs god goddess godly godown godson goggles gogo goings golem
golly goner gong gonzo goo goober goodie goodly goody gooey goof goofed goofing goofy googly goon
goons goop goose gor gored gorge gorges gorgon goring gory gosh gossips gouge gouged gouging gourd
gout gowan gown gowns goy grabber grabby grabs grace graded grader graft graham grail gram gran
granary grandad granddad grange granger grant grappa grasp grasses grassy grate grater gravy grayer
grays graze grease greaser greed greedy greek greener greenery greenie greens greet greeted greets
greys grids grief grieve griff grift grille grilling grills grim grime grimy grin grind grinding
gringo grinning gripe griping gripping grips grit grits gritty groan groat grocer grog groggy groom
grooms groovy grotto grout grower growl grub grubby grubs grudge gruel gruff grump grunge grunt
guan guano guava guessed guesses guff guiding guile guilt guise gul gulag gulch gull gullet gulls
gully gulp gulps gumbo gummer gummy gums gun gunk gunned gunner gunning gunny guns guppy gush
gussie gust gusto gusts gut guts gutsy gutted gutter gutting guv guzzle gyms gyp gypsy gyro habit
hacks hades hadji hae hafiz hag haggard haggis haggle hags hah haha haiku hail hails hairs haj haji
hajj hajji hakeem hakim hale hales hallo hallow halls hallway halt hamada hammy hams hamza hang
hangar hangs hank hanks hanky hanuman hao hap harass hardy hare hares hark harms harp harps harpy
harrow harry harsh harsher hassle hassles hast haste hasty hatch hatchet hate hated hater hates
hath hatter haul hauls haunt haute haves havoc haw hawks hays haze hazel hazy headache heady heal
healed healer heals heap heaped heaps hears hearse hearth heathen heather heats heave heck heckle
hectic hedge hedgehog hedges heed heeded heeds heels hefty heh heifer heil heinie heir heiress
heirs heist heists helix hell heller hellish hells helm helo helper helpless hem hemmed hemp
henchmen henna henry hens hep herb herd herded herder herders herds heres heresy hereto heron hers
hertz hes het hetero hex heyday hic hiccup hick hicks hides hiding hie hike hiked hiker hikes hilly
hilt hin hind hinge hinting hippie hippies hippo hippos hippy hips hires hiss hisses hissing hissy
hitch hither hitter hive hives hmm hoard hoax hobbit hobble hobo hobos hock hocus hoe hoes hog
hogan hogg hogging hogs hoist hoke hokey holed holla holler hollows holly holm holt homer homeroom
homey hon honcho hone honed hong honing honk honks honky honour hooded hoodie hoodoo hoods hooey
hoof hoofs hookah hooked hooks hooky hoop hooper hoopla hoops hoorah hooray hoot hoots hooves
hopped hopper hoppy hops hora horde horns horrid horrors horst hosanna hosed hoses hostess hotch
hotdog hots hotshot hotter hound hove hovel hover howdy howe howl howls hows hoy hoyle hub hubbub
hubby huck huddle huddled hue hues huff huffs huffy hugged hugger hugging hugs huh hula hulk hulks
hullo humbug humdrum humid hummer hummus humour hump humph humps hums humvee hun hunch hunh hunk
hunks hunky huns hunts hup hurl hurrah hurray hurry hurst hurts hush hushed husk husky hussars
hutch huts huzzah hwan hydra hydro hyena hymen hymn hymns hyoid hype hyped hyper hypo ibis iced
ices ich icicle icicles icing ick icky iconic icy ides idiocy idiom idiot idiotic idiots idling
idly idols ids idyllic iffy ifs igloo ignite igniting ignition ignoring iguana iliad ilk ill
illicit ills imam imitate immense immerse imminent imp impala impede imply inane incense incision
incite inciting incline incur indict indie indies indigo inept inert infer infinity infirm info
inhibit initiate inkling inky inland inlet inn innate inning innings ins insane insides insignia
insipid insist insists instill instinct intact intents intern invent inviting iodine ion ionic ions
iota irate ire iridium iris irises ironic ironing irons irony irritate isles issuing itch itchy ivy
jab jabber jabs jack jackal jackass jacks jacky jaded jaeger jag jagged jagger jails jake jakes
jammed jammer jammy jams jane japan jarl jars jaunt java jaw jaws jay jazzed jazzy jean jee jeepers
jeeps jeez jefe jellies jelly jenny jeon jerk jerked jerks jerky jerries jerry jersey jerseys jess
jesse jest jester jetty jew jeweler jeweller jewels jews jezebel jiao jib jiff jiffy jig jigger
jiggle jiggling jiggly jihad jill jiminy jimmy jin jingling jinks jinn jinx jive jock jocko jocks
joe joes joey jogged jogger jogging jogs john johnny johns joked joker jolly jolt jones josh joss
jot joust joyous joys judas judge judged judo jug juggle jugs juicy jujitsu juju juke jumbo jumps
jumpy jun junky junta jura juror jurors jus jut kabbalah kabuki kahuna kaka kale kamala kami kana
kane kanji kapa kappa kaput karat karate kat kata kay kayak kayo kazoo kebab kebabs keck keel
keeled keener keenly keeper keepers keepsake keg kegs kelly kelp kemp ken kendo kennel kennels keno
kens kent kerb kern kerry kersey kettle kettles keyed khaki khakis khan kibble kickback kicked
kicker kicking kickoff kicks kidder kiddie kiddies kidding kiddo kiddy kif kill killed killer
killing kills kiln kilo kilos kilt kimchi kimono kin kingpin kink kinks kino kiosk kip kipper kir
kirk kissed kisser kisses kissy kites kitten kitties kitty klutz knack knave knead kneel kneels
knees knell knelt knob knobs knockoff knocks knoll knot knots koala koalas kohl koi kook kooks
kooky kor koto kowtow kraft kraken kraut krill kris kroner kronor kudo kudos labelled labia lac
laced laces lacey lacks lacs lacy lad laddie ladle lads lag lager lagging lagoon laguna lain lair
laird laker lakh lakhs lam lama lambs lame lamia lance landau landed landfall landlady lang lanky
lapel lapis lapped laps lapse lapses lar lard larder largo lark larks lars larva larvae las lasagna
lasers lash lashes lass lasses lassie lasso lastly lasts lat latch latent lateral lathe lats latte
lattes laura laurel lava lavage law lawful lawless lawman lawns lax layaway layman lays lazar lea
leach leads leaflet leafs leafy leak leakage leaked leaks leaky leaned leans leant leap leaped
leaps leapt lear learner leary leased leases leash lech lecher led ledge ledger lee leech leeches
leek leeks leer leery lees leeway lefts lefty legate legged leggy legible legit legless lei lek
lemur lend lends lenient leno lent lentil leone leper lepers lessen lest lethal lets lettuce lev
levee leveled levelled lever levers levin lewd lewis lex ley liaise liana liane liang liar liars
lib libel libido libra lice licence lick licks lido lids lied liege lien lieu lifeless lifelike
lifeline lifer liftoff lifts liking lilac lilacs lilies lily lima limb limbic limbo limbs limes
limey limo limos limp lin linden lindy linen linens liner ling lingo linguini lining linn lino lint
lippy lira liras lire lis lisp list listless lit lite liter litre litter littlest lively liven
livid llama llamas loaf loath lob lobe lobes lobo lobos loca locals loch loco locos locus lode
lodged loft lofty logan logbook lollipop lolly lollypop loner longing longs loo loofah looker
lookout loom looms loon looney loony looped loophole loopy loos loosed loosely loosen loosens
looser loot looted lop lope lord lords lore lorry loser losers loses lotion lotte lotto loudly
louie louis loup louse lousy lout louts loveless lowdown lowe lowly lox loyal loyally loyalty luau
lube luce lucid lug luger lugging lull lullaby lulled lulu lum lumen lump lumps lumpy luna lunar
lune lunge lungs lupin lupus lurch lure lured lures lurid lurk lurks lush lute lutz luv lux lye
lymph lynch lynx lyre maar mac mace mach macho mack macon madam madame madcap madden madder madly
madman madmen madonna madras madre mads mae mafia mag mage maggot magi magma magnum mags magus
maharaja mahatma maid maids maim maimed mains maize major mako malady malaria mallard mallet malls
malt mama mamas mamba mamie mamma mammal mammals mammoth mammy mana manatee mandala mane mange
mangy mania maniac manic manila manly manmade manna manned manning mano manos mans manta mantra
mantua mapped mar marc mare mares marge maria marina marinara mark marly maroon marred marrow marry
mars marsala marsh martyr mas mascara mash masks mason masons massa massages masse masses masseuse
mast masts mat mated mater mates matey maths mats matt matte matzo maud maul mauve mavis maw max
maxi maxim maya mayan mayday mayhem mayo mays maze mead meager meagre meaner meanie meanness
measles meats meaty mecca med meddle meddled medic medley meek meeker mel meld melee mellow melon
melt melted melts mem memento memoir memos menace menage mend mended mensa meow meows mercer merde
merged mergers merle merman merrier mesdames messed messes messier messy meta mete meteor metre
metres metro mettle mew mews mica mick midair midday midge midst miffed mig mignon migs mike mikes
mil mildly miles milieu militia milky mille millet milling milo milos milt mim mimes mimic mimics
mimosa mimosas mina minas mince minded minding mined miner mingling mini minimise minion minions
minivan mink minnow mints minty minx mir mire mired miri mirth mirza mis misdeeds miser miseries
misfit misfits miso misses missiles missis missus missy mist mists misty misuse mite mites mitt
mitten mitts mixes moan moans moat mob mobbed mobs mocha mock mocks mod modeled modelled modem modi
mods modus mogul moira moist mojo mol molar molded molds moldy mole moles mollie moloch molto moly
momento momma mommies mommy mon monde mondo mongo mongol monk monks mono monotone monotony mons
monsoon moo mooch moods moody mooing moolah mooning moons moor moored moors moos moose moot mope
moped mopey mopped mops mor mora moray morel morello mores morn morocco moron morons morose morph
morris morrow morse mort mortar mos mosey mot moth moths motif mott motto mouch mould mound mourn
mousse mousy mover mow mowed mower moxie muck mucky mucous mucus muddle muddled muddy muff muffin
mugged mugger mugging mugs mulch mule mules mull mullah mullen muller mullet mum mumble mummies
mummy mumps mums mun munch mungo mural murky murmur murmurs mus muse muses mush mushy musk muss
mussel mussels musty mutant mutate mute muted mutt mutter mutton mutts muzzle muzzy myrrh myths nab
nabbed nacho nada nadir nae nag nagged nagging nags nah nailing naive nam naming nan nana nance
nancy nannies nanny napalm nape napkin napping nappy naps narc narco narcs narrate narrator nary
nasal natal natty nausea nave navel naw nawab nay nearer nears neat neater neath neb necks nee
needing needles needless needy negate neigh neighing nellie nelly nemesis nene nephew nerd nerds
nerdy nerves ness nests nether nets netted netting nettle nettles neuron neuter neve newt nexus
nibble nibbling nibs niceness nicer niche nick nicking nicks niece nieces nieves nifty nigh nil
nils nim nines nineteen nineties ninety ninja ninjas ninny ninth nip nipped nipper nipping nippy
nips nit nite nitric nitro nits nitwit nitwits nix nob nobby nobly nodded nodding node nods noel
nog noggin noh noir noises noisy nom noma nomad nome nominee nona nonce nonfat nonsense nonstop noo
noodle nook nooks noose nope nor nori norm norms nos noses nosey nosh nosing nosy notation notch
noting notions noun nous nova nowt nozzle nuance nub nubia nudge nugget nuke nuked nukes null numb
nun nunnery nuns nurture nutter nutty nylons nymph oaf oar oars oat oath oaths oats obese obey
obeyed obeys obi obit oboe obsess obsessed occupy oddball oddest oddity oddly ode odious odor odors
odour ods odyssey offal offed offence offend offended offenses offing offload offs oft ogle ogling
ogre ogres ohm oho oiled oily oink oka okeydoke okra olden oldie olds ole omelet omelette omen
omens omer omission omit oneness onions ons onset onyx oodles ooh oohs oolong oomph oops oot ooze
oozes oozing opal ope opener openness oppose opposes oppress ops opt opted optic opus ora oral
orally orator oratory orb orbs orc orca orcs ore ornery ortho ostia otter otters otto ottoman ouch
ounce oust outdid outdo outed outfit outpost outposts outrun outs outset outwit ouzo ovens overdo
overs oversee overseer oversees overt owe owed owes owing owls owning oxen oxford oxy pac paced
pacer paces pact padded paddle paddy padre paella pagan pagans page paged pager paging pagoda pah
pail paining pains paisa paise pajama pajamas palais palate palatial palazzo paler pales palette
pall pallet pally palms palp palpable pals palsy pam pamper panda pandas pane panes pang pangs
panned panning pans pansy pant pap papa papacy papal papaya pappi pappy paprika par para paraded
parapet pariah paris parka parlay parlor parr parrot parry part pas pascal pasha passages passe
pastis pasts pasty pate pater pats patsy patted patter pattie patty pauper pause pauses pave paved
paw pawn pawnee pawns paws pax payed payoff pea peach peaked peaks peaky peal pears pease peat
pebble pebbles pecan peck pecked pecker pecs ped pedal peddle peddler pedes pedro peds peek peeked
peel peeled peeler peels peep peeped peeper peepers peephole peeping peeps peered peerless peeved
peewee peg pegged pegs pele pellet pellets pelt pelts penal penance pence penitent pennant penned
penner pennies penny pent peon peons peony pep peppered peppers peppy per perch peri peril perjure
perk perks perky perm perry pert peruse perverse pervert pesetas pesky peso pesos pester pesto
pests petal peter peters petit petter petty pew pews peyote pfft pharaoh phat phew phi phlox phoebe
phony phooey photon pia piazza pic piccolo pickwick picky picnics pieced pied pier pierce piers
pies piety piggies piggy pigpen pigs pika pikes pilaf pilar pile piled piles pileup piling pillar
pills pilot pimple pina pinata pinch pines piney ping pinging pings pining pinkie pinks pinky
pinned pinning pinot pinpoint pint pinto pints pinup pious pip piped piper piping pippin pips pish
pita pithy pitied pits pitted pitting pity piu pivot pix pixel pixie pixies pixy pizzas plaid plait
plank playa plea plead pleaded pleas pleases pled pledged plod plonk plop plow plows ploy pluck
plugs plum plumb plume plump plums plural plush ply poach poco pod pods poets poi poise poisons
poke poked poker pokes pokey pol poles polio polka pollen pollock polyps pom pomp pompous ponce
poncho ponds pong pontoon pony pooch poodle pooh pooled poop pooped pooping poops poorer poorly
popcorn popes poplar poppa popped popper poppers poppet poppies popping poppy pops porch pore pores
porgy porky porous posed poser poses posh posies posse posses possum possums potent potion pots
potted potty pouch pours pout pouty pow pows powwow pox pram prank prat prawn prays precede
preceded premed prepares prepped preppy presses pretext prettier prey preyed preys prez price pried
prig prim prima primer primo priors priory prism priss prissy privy pro proctor prod prodded prof
proffer prom promo promos prone pronoun pronto proofs prop propel proposes propped props prose
prosper prost proton prowl prude prune pry psalm psalms psi psst psych pub puck pucks pud puddle
pudgy puff puffed puffer puffin puffs puffy pug pugh puja puke puked pukes puller pulley pulls pulp
pulpit pulses puma pummel pumped pun punks punky puns punt puny pupil puppet puppets puppies pups
puree purer purge puri purr purrs purser purses pursuers pursues pus pushes pushups pushy puss
pussies putt putter putty putz pygmy pylon pyre qua quack quads quai quail quake quark quarry quart
quasar quash quay quell queues quid quill quills quinine quint quips quirk quirt quits quorum quota
rabbi rabbis rabble rabid raccoon raced racer racers racoon racy rad radial radon raff raffle raft
rafts rag raga raged rages ragged ragging raging raglan rags ragtag rah raided raider raids rails
rainier raining rains rainy raisin raisins raj raja rajah rake raked rakes raki ralph rami rammed
rammer ramp rampart ramps ramrod rams rance rancor rand randy rang rani rant rants rap rapper
rappers rapport raps raptor rarer rarest raring rarity ras rascal rascals rash rashes rasp raspy
ratan rath ratted rattle rattler ratty ravage rave ravel raven raves raya raze razed razer razor
razors reacher react real reals ream reams reap reaped reaper reapers reappear reared rears
reassess reassure reb rebar rebelled rebels reboot reborn rebs rebuke rebus rec recap recede recess
recessed recesses recheck recite recon recreate rector recuse recycle redder redeemed redeemer
redid redness redo redone redress reds redwood ree reeds reefs reek reeked reeks reels reentry rees
reeve reeves ref referee referees refill reflex reformer refuel refuge refugee refuses refute reg
regal regatta regent reggae regress regret regrets regs rehab rehash rehearse reheat rei reign
reigning rein reindeer reins reis relent relic relied relies relieve relive rem remade remake
remarry remedied remiss remit remorse remover renal rename renders renege renewed renown rented
renter rents reopen rep repartee repay repeal repel repelled repent repo repose repress reprieve
reps repute reread reroute rerun reruns res resale rescuer rescuers rescues resell resent resents
reside resided resides resin resists restart rested restless restores rests retake retire retires
retort retrace retract retreats reuse rev reveille revel revelry revels revere revered reverend
reverie reversed reverses revert reverted revise revive revived revoke revolve revolver revs revue
revved rewarded rewire rework rewrite rewrote rex rhea rhino rho rhubarb rhyme ria rib ribs rich
richer ricin rick ricks ridden ridding riddle riddled riddler rife riff riffraff riffs rifle rift
rig rigged rigging rigid rigor rigs rile riled riles riley rim rimmer rims rin rind rinds ringer
ringing rink rinse riot riots ripen ripped ripper ripping ripple rips risen riser rises rishi
riskier risky risotto rite rites ritter ritz ritzy rival rivet riviera roach roam roams roan roar
roared roars roast roasts rob robbed robber robbers robbery robe robes robin robs roc rocker rode
rodeo rods roe roger rogue rolf rollers rom roman romano romeo romp rondo roofs rooftop rook rookie
rooks roomie roomy roost rooster roosters root rooted roped roper ropes roque rosaria rosary roscoe
rosette rosy rot rota rotate rotator rote roti rotor rotors rots rotted rotten rotter rouen rouse
rout roux rove rovers rowan rowdy rowed royally rubbed rubbers rubbery rubble rube ruble rubs ruby
ruckus rudd rudder ruddy rude rue ruff ruffle rugby rugged ruin ruining ruins ruler rulers rum
rumba rummy rumor rumors rumour rumours rump rumpus rune runes rung rungs runners runny runoff runt
rupee rupees rupture ruse rushes rusk rust rusty rut ruth rye sabbath sabe saber sabers sabes sable
sabre sac sack sacks sacs saddened saddens sadder saddest saddle saddled saddles sade sadhu sadist
sadists sadly sadness sae safes safest sag saga sages sagging saggy sahib sails saith sakes saki
sal salaam salads salami salinas saliva sally salons saloon saloons salsa salts salty salve salvo
samara sambar samosas sandal sandals sandman sands sandy sane sang sank sans santo santos sappy
saps saran sarcasm sardar saree sarge sari sarin saris sark sash sashay sashimi sass sassy sated
satsuma satyr sau sauces saucy saul sauna sausage sausages savages savanna savannah savant savin
savor savoy savvy sawed saws sax sayer sayers sayid scab scabby scabs scalp scalps scaly scam scamp
scams scans scant scar scarab scarce scare scares scarf scars scent scents sciatica scion scissor
scissors scoff scoffs scold scolds scone scones scoops scoot scopes scorch scorer scorn scot scotch
scots scour scouts scowl scram scrap scraps screech screws scrip scrolls scrub scrubs scruff scuba
scuff scull scum scurry seabed seals seam seaman seamen seamless seams seance sear seared sears
seashell seaside seated seaweed sec secrecy secrete secs sect sects sedan sedate sedated seder
seeded seedy seep seeped seeps seer seesaw segue sei seine seismic seize seized seizes selects
selfless selves semi semis semple sen seneca senile senna senor sensed senses sensing sensuous
sentient seppuku sepsis sept sequel sequels ser sera serene serf serfs serge servo sesame settee
setter settler settlers settles sevens sever severed sew sewage sewed sewer sewers sewn sews sha
shabby shack shacks shad shaded shady shafts shag shaggy shah shakes shaky shale shalt sham shaman
shamans shames shamus shank shanks shard shards sharks sharps shat shave shaves shaw shawl shawn
shay shea shear shears sheath sheaves sheds sheen sheik sheikh shekels shelled shells shelly
shelves sherry shes shh shifts shill shim shimmy shin shines shining shins shiny shire shirk shiv
shiva shivas shoal shoals shocks shod shoddy shoji shone shoo shook shoot shootout shoots shores
shout shouts shove shoves showoff showy shred shredded shredder shreds shrew shri shrill shrub
shrubs shrug shuck shucks shun shunt shush shushes shuts shy shyness siamese sic sicko sickos sided
siding sidle siege sienna sierra siesta sieve sift sigh sighing sighs sights sigma sikes silica
silks silky sill silliest silo silos silt silva sim sima simian simmer sims sin sine singe sings
singsong sinking sinks sinned sinner sinners sinning sins sinus sinuses sipping sips sire sired
siree siren sirens sirrah sirree sirs sis sissies sissy sitar sith sits sitter sixes sixties sixty
sizing sizzle sizzles ska skate skates skewed skewer skewers skid skidded skids skied skier skiers
skies skiff skim skimp skinning skinny skint skip skips skis skit skittish skivvies skull skulls
skunk skunks slab slabs slack slacks slag slags slain slam slams slang slant slap slaps slash
slashes slate slats slave slaves slaw slay slays sleaze sled sledge sleek sleeper sleepers sleepy
sleet sleeves slept slew slice slices slick slid slime slimy sling slinging slings slink slips slit
slits slob slobs slog sloop slop slopes sloppy sloth slows slug slugs slum slump slums slung slur
slurp slurps slurry slurs slush sly smack smacks smalls smarmy smartass smarts smash smashes smear
smears smelled smells smelly smelt smiles smirk smite smiths smock smog smokes smoky smooch smug
snack snacks snafu snag snags snail snails snakes snappy snaps snare snares snarl snarls snazzy
sneak sneaks sneer sneeze sneezed sneezes snell snide sniff sniffing sniffs snip snipe snipes
sniping snippy snob snobby snobs snog snogging snook snoop snoopy snoot snooty snooze snore snores
snort snorts snot snotty snout snows snowy snub snuck snuff snug soak soaks soaps soapy soar soars
sob sober sobs sod soda sodas sods sofas softest softy soggy soils soiree sol solano soles solids
soloist solon solos solves soma someones sonar sonata sone sonnet sonnets sonny sook sooner soonest
soot soothe soothes sop soph soppy sora sorcerer sordid sore sores sorrel sorrier sorrow sorrows
sos sot sou soulful soulless soups sour sourpuss sous sow sowed sown sows sox soy soya soyuz spa
space spade spades spake spans spar spares spark sparks sparse spasm spasms spat spate spats spawn
spaz spear speck specks sped speeded speedo speedy speer spelled spells spelt spence spends spew
spewed spheres spied spiel spiffy spike spikes spiky spill spills spilt spines spinning spins spiny
spire spires spit spite spits spitz splash splat spleen spliff splits spoil spoils spokes spoof
spook spooks spooky spool spoon spoons spore spores spotty spouses spout sprays spree spry spud
spuds spun spur spurn spurs spurt squab squads squall squash squat squats squaw squeeze squeezes
squid squids squish sri stab stabs stacks staffs stag stagnant stain stains stair stairs stakes
stalag stale stalk stalks stall stalls stank staph stare stares stark starry starters stash stasis
stat stats statue statues stave stead steak steaks steals steed steely steep steeped steeper
steeple steer steered steers stein stella stems steppe stepped steppes stereos stern stew stewed
stiff stiffs stiles stills stilts sting stinging stings stink stinks stint stipe stir stirs stitch
stoic stoke stokes stole stomp stomps stony stooge stooges stool stools stoop stork storks storms
stout stove stoves stow strait straits straps strata straw straws stray strays strep stressed
stresses stroll strolls strum strums strut struts stub stubby stubs studded studs stuffs stuffy
stump stumps stun stung stunk stunt stunts stutter stutters sty stylist suave subbed subdue subdued
subs suburb suburbs succeeds succubus succumb sucre suds sue sued suede sues sufferer suffers
sugars suing sulfur sulk sulky sullen sully sulu summa summed summers summits summon summons sumo
sump sums sunburn sung sunk sunken suns sunsets suntan sunup sup supper supple suppress sura surest
surfer surfers surges surly surpass sushi suspense suss sutra suture sutures swab swabs swag swain
swallow swallows swam swami swamp swamps swamy swans swaps swarm swarms swat sway sways swear
swears sweat sweats swede swedes sweep sweeper sweepers sweeps sweeten sweeter sweetest sweetie
sweeties sweets swell swelled swells swept swerve swig swill swims swine swinging swings swipe
swirl swirls swish swiss swoon swoop swoops swoosh swords swore sworn swum swung sykes sync synch
syne synod synth syrup tabby taboo taboos tabor tach tack tacks tacky tacos tact tactic tactical
tad tae taels taffeta taffy tagging taiga tails taint taipan taj taka taker takin tali talky taller
tallest tallis tally talon tam tamale tame tamed tamer tammy tang tangent tango tangy tanned tanner
tanning tans tansy tanto tao tapas taped taper tapped taps tardy tarmac tarn taro tarot tarp tarred
tarry tarsus tartan tartar tartars tarzan tas tassel tassels tasted taster tastes tasty tat tate
tater taters tates tats tattered tatters tattle tattoo tattooed tattoos tau taunt taunts taut tawny
taxed taxis taxman teak teal teamed teammate teapot teary teas tease teased teaser teases teat
teatime teats ted teddy tee teen teens teensy teeny teepee tees tel tele telex teller tellers
telltale telly temp temper tempest tempo temps tempt tempted tempts tenants tended tendon tends
tenement tenets tenner tenor tens tense tensed tenth tents tenure tepid termed termite terra
terrier terror terrors terry tesla tester testy tet tether tethered tetra texas thane thataway thaw
theatre thefts themed thence theres theses thief thigh thighs thine think thinning thins thirst
thither tho thorn those thrall thrash threes threw thrift thrill throb thru thrush thrust thrusts
thud thuds thug thugs thump thunk thwart thy thyme tiara tibia tic tick ticks ticktock tics tidal
tidbit tides tidied tidy tiers tiff tiffin tights tiki til tiller tilt tilted tilting timed timid
tine ting tinge tingling tiniest tinned tinny tins tint tinted tipped tipper tipping tippy tipsy
tiptoe tiring tis tissues titan titanic titans tizzy toad toads toady toast toasts toasty tobacco
toby tod toddy toes toffee tofu toga toil toke toledo tolls tom tomb tomboy tombs tomcat tome tommy
toms toned tong tonga tongs tonic tonne tonnes tony toon toot tooting toots tootsie topaz toph
topped topper topple tor tora torah torch tore tori torn toro toros torrent torrid torso tort
torture torturer tory tosh toss tossed tosses tot tote totem totes toting tots toupee tout tow
towed towel toxin toyed toyo tracer tracts traded trait traitor traits tram tramp trams trapper
traps trawl trays tread treats treble treetop tremor tresses trey triad trier trig trill trills
trimmer trine tripe trippy trite triton trivia trod trois troll trollop trolls troop trooper trot
troth trotter trotters trove troy truant truce truer truest trump truss trusty truths tryout tryst
tsar tsk tuba tubby tubs tuck tucks tuff tuft tug tugging tugs tui tulip tulle tummy tumour tumult
tun tuna tuned tung tunic turbot turd turds turf turk turks turnout turret turrets tush tusk tusks
tussle tut tutor tutors tuts tutti tutu tux twa twain twang twas tweak tweed tweedle tween tweet
tweeted tweets twerp twig twiggy twigs twine twirl twists twisty twit twitch twitter twixt twos
tycoon tye tying tyke tyne typed typist typo tyranny tyrant tyre tyres udder udders udo ugh ugly
ukulele ulcer ulna umm ump unborn unbutton uncanny uncommon uncool uncuff uncut undead undid undone
undue unduly unease uneven unfit unhand unhook unhurt unify unison unite uniting unjust unkind
unplug unruly uns unseen unsound unsung unsure untie untrue unused unwed unwell unwind unzip uphill
upkeep upped uppers upping uppity uproar uproot ups upsets urged urges urging urine urn urns ursa
useless usher ushers usurp usurper usury uta utmost utter uttered vac vacancy vacant vacate vague
vail vain vale valet valor vamp vamps vanda vandal vane vans vapid vapor vas vasa vase vases vassal
vassals vat vats veal vee veena veer veered veg vegan veggie veggies veil veiled veils vein veins
velvety vena veneer venom vent vented vents vera verb verbs verge verger versed verses vert vespers
vest vesta vested vests vet veto vetoed vets vetted vex vexed via vial vials vibe vibes vicar vice
vices vichy victim vie vig vigil vigor vile villain vine vines vino viola viper virgin virile vis
visas vise visions visor vita viva vive vivid vividly vixen vizier vogue voila vole volley volta
volts vomit voodoo voter vouch vow vowed vowel vows vroom vying wack wacko wacky wad waddle wade
waded wadi wads wafer waffle waged wager wagging waging wags wahoo wail wails waist waits waive
waked waken wakes walkway walla walled wallop wallow wally waltz wan wand wands wane waning war
warder wards wares warfare warmer warms warn warns warp warren warsaw wart warts wary wasabi washes
wasp wasps wast wastes wat waved waver wavy waxed waxy wayward weaken weaker wean weaned wearer
wears weary weasel weasels weave weaver weaves webbed webby weber webs wed wedded wedge wedged
wedges wedgie weds wee weed weeds weenie weenies weeny weep weeps weepy weet weevil weigh weiner
weir weirder welch weld welded welder welsh welt wen wept wets wetter wha whack wham whammy wharf
wheal whee wheeled wheeler wheelie wheeze wheezes whelp whence wheres whet whew whey whiff whim
whims whine whining whinny whiny whip whips whir whirl whirrs whirs whisk whist whit whiz whizz
whoa wholly whoop whoopee whoops whoosh whooshes whys wich wick wicks widdle widen widened widow
widowed widows wield wielded wiener wig wiggle wiggling wiggly wiggy wight wigs wigwam wilco wildly
wilds wile wiles wilful will willed willful willies willows wills wilt wilts wily wimp wimps wimpy
winch wincing winded winding windy wine wines winging wining wink winking winks winnings wino wipe
wiped wiper wipes wiping wiry wiseass wiser wisest wisp wit wits witty wiz wobble wobbly woe woes
wog wok woke woken wonky wont wonton woo woodcock wooded woodwork woody wooed woof wooing woolen
woolly wooly woozy wop worded wordy wore workroom worms wormwood worrier wort wove woven wowed
wrapper wraps wrath wreak wreck wrecker wren wring wringing wrists writ wrung wry wuss wussy wynn
xenia xenon xerox yah yahoo yahoos yak yaks yam yams yank yanks yap yar yaw yawn yawns yay yea
yearn yeh yell yelled yeller yells yelp yelps yen yens yep yeses yeti yew yielded yikes yin yip
yippee yipping yod yodel yogi yoke yokel yolk yolks yom yon yoni yore youse yow yowls yuan yucca
yuck yucky yuk yule yummy yup yuppie yurt zag zaire zany zap zapped zaps zeal zed zee zeroed zeroes
zeros zest zeta zig zigzag zilch zillion zin zing zipped zipper zipping zippy zips zit zits zloty
zoned zoology zoos
`.trim().split(/\s+/);
