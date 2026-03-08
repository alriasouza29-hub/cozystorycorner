// API Configuration
const API_BASE = 'http://localhost:5000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let currentLanguage = null;
let currentStory = null;

// Story database
const storyDatabase = {
    spanish: [
        {
            id: 1,
            title: "El Viaje de Marina",
            level: "Beginner",
            duration: "5 min read",
            description: "A heartwarming tale of a young girl discovering her courage.",
            content: "Marina era una niña tímida que vivía en un pequeño pueblo cerca del mar. Un día, decidió explorar el bosque que nadie visitaba. En el camino, encontró un pajarito herido. Con paciencia y amor, Marina cuidó al pajarito hasta que pudo volar de nuevo. Ese día, Marina descubrió que tenía un corazón valiente. El pajarito voló alto en el cielo, llevándose consigo la gratitud de Marina."
        },
        {
            id: 2,
            title: "La Amistad de Dos Estrellas",
            level: "Intermediate",
            duration: "8 min read",
            description: "Two stars learn the true meaning of friendship.",
            content: "En el cielo nocturno, dos estrellas brillaban juntas. Una era grande y luminosa, la otra era pequeña y tímida. La estrella grande siempre guiaba a marineros en el mar, mientras que la pequeña solo podía brillar levemente. Un día, la estrella grande se dio cuenta de que sin su amiguita pequeña, su brillo no significaba nada. Juntas, creaban un patrón hermoso en el cielo que todos admiraban. Aprendieron que la verdadera grandeza está en apreciar a quienes están a nuestro lado."
        },
        {
            id: 3,
            title: "El Café de Don Roberto",
            level: "Intermediate",
            duration: "10 min read",
            description: "A story about tradition, community, and the perfect cup of coffee.",
            content: "Don Roberto tenía un pequeño café en una esquina del pueblo. Cada mañana, preparaba café con amor y dedicación. Sus clientes no venían solo por el café, sino por la calidez de sus palabras y su sonrisa genuina. Un día, una joven llegó triste y sola. Don Roberto le ofreció una taza de café y le escuchó con atención. Ese café, servido con compasión, cambió el día de la joven. Así, Don Roberto entendió que el verdadero valor de su café no estaba en los granos, sino en el amor que ponía en cada taza."
        }
    ],
    french: [
        {
            id: 4,
            title: "Le Rêve de Sophie",
            level: "Beginner",
            duration: "5 min read",
            description: "Sophie's journey to follow her dreams.",
            content: "Sophie rêvait de devenir danseuse depuis son enfance. Chaque jour, elle dansait dans sa petite chambre sous les étoiles. Les gens du village lui disaient que c'était impossible, mais Sophie ne les écoutait pas. Elle dansait avec passion et détermination. Un jour, une professeure de danse visita le village et vit Sophie danser. Elle fut tellement impressionnée qu'elle proposa à Sophie de l'aider. Le rêve de Sophie était en train de devenir réalité."
        },
        {
            id: 5,
            title: "La Bibliothèque Magique",
            level: "Intermediate",
            duration: "8 min read",
            description: "A magical library hidden in the heart of Paris.",
            content: "Dans une petite rue cachée de Paris, se trouvait une bibliothèque mystérieuse. Les livres dans cette bibliothèque avaient le pouvoir de transporter les lecteurs dans leurs histoires. Un jeune garçon découvrit cette bibliothèque par hasard et ouvrit un livre ancien. Il fut instantanément transporté dans un château du Moyen Âge. En traversant les pages, il apprit des leçons précieuses sur le courage et l'amitié. Quand il revint à la bibliothèque, il comprit que les vraies histoires magiques sont celles qui changent nos cœurs."
        },
        {
            id: 6,
            title: "La Maison de Grand-Mère",
            level: "Intermediate",
            duration: "10 min read",
            description: "Memories and warmth in grandmother's house.",
            content: "Chaque été, Marie rendait visite à sa grand-mère qui vivait à la campagne. La maison sentait les fleurs et le pain frais. Sa grand-mère lui racontait des histoires du passé tout en tricotant. Ces moments simples remplissaient le cœur de Marie de joie pure. Un jour, sa grand-mère lui donna un vieux châle qu'elle avait tricoté. En l'enveloppant, Marie sentit l'amour de générations de femmes. Elle comprit que les plus belles héritages ne sont pas matériels, mais émotionnels."
        }
    ],
    japanese: [
        {
            id: 7,
            title: "小さな太郎の冒険",
            level: "Beginner",
            duration: "5 min read",
            description: "Taro's small adventure in the village.",
            content: "太郎は小さな村に住む少年でした。毎日、彼は近所を探検するのが好きでした。ある日、彼は古い神社を発見しました。神社の庭には美しい桜の木がありました。太郎は毎日この木の下で読書をするようになりました。やがて、他の子供たちも集まるようになり、この場所は子供たちの特別な場所になりました。"
        },
        {
            id: 8,
            title: "お月さまの物語",
            level: "Intermediate",
            duration: "8 min read",
            description: "The moon tells its story across the seasons.",
            content: "お月さまは毎晩、静かに地球を見守っていました。春には桜の花を照らし、夏には涼しい夜を作りました。秋には紅葉を美しく見せ、冬には雪を輝かせました。ある夜、小さな女の子がお月さまに話しかけました。彼女は学校で友達ができなくて悲しかったのです。お月さまは静かに彼女を照らし続けました。その光を受けて、女の子は自分も誰かの人生を明るくすることができることに気付きました。"
        },
        {
            id: 9,
            title: "おばあちゃんの味",
            level: "Intermediate",
            duration: "10 min read",
            description: "The taste of grandmother's love through cooking.",
            content: "ケンは高校生になって、おばあちゃんの家を訪れなくなりました。忙しい日々に追われていたのです。ある日、おばあちゃんは特別な和食を作ってケンのために待っていました。ケンが一口食べると、子どもの頃の思い出がよみがえりました。涙がこぼれました。おばあちゃんは何も言いませんでしたが、その食事には、何十年もの愛情と時間が詰まっていたのです。ケンはその日から毎週おばあちゃんを訪ねるようになりました。"
        }
    ],
    german: [
        {
            id: 10,
            title: "Der kleine Läufer",
            level: "Beginner",
            duration: "5 min read",
            description: "A young boy discovers his passion for running.",
            content: "Hans war ein stilles Kind, das nicht in der Schule aufpassen wollte. Aber wenn er lief, wurde er lebendig. Er lief durch die Wälder, über die Felder und entlang des Flusses. Eines Tages bemerkte sein Lehrer seine Schnelligkeit. Der Lehrer schlug vor, dass Hans zum Lauftraining gehen sollte. Hans entdeckte, dass er laufen liebte und dass dies sein eigentlicher Traum war."
        },
        {
            id: 11,
            title: "Das alte Schloss",
            level: "Intermediate",
            duration: "8 min read",
            description: "Secrets hidden within an old castle's walls.",
            content: "Ein altes Schloss stand auf einem Hügel in der Nähe von Stuttgart. Niemand wagte es, hineinzugehen. Ein mutiges Mädchen namens Anna entschied sich jedoch, es zu erkunden. In dem Schloss fand sie alte Gemälde, Briefe und Musik. Jedes Objekt erzählte eine Geschichte von Liebe, Verlust und Hoffnung. Anna verstand, dass jeder Ort eine Geschichte hat und dass die Geschichte einer Gemeinschaft in ihren alten Gebäuden lebt."
        },
        {
            id: 12,
            title: "Der Garten der Großmutter",
            level: "Intermediate",
            duration: "10 min read",
            description: "A grandmother's garden teaches lessons of patience and growth.",
            content: "Großmutter hatte einen wunderschönen Garten hinter ihrem Haus. Jede Pflanze war mit Sorgfalt gepflegt. Ihr Enkel frug sie einmal: 'Großmutter, wie bringst du die Blumen zum Blühen?' Sie antwortete: 'Mit Geduld, Liebe und Zeit. Du kannst nicht erzwingen, was sich natürlich entwickeln soll.' Diese Weisheit verfolgte ihn sein ganzes Leben. Er verstand, dass echtes Wachstum nicht schnell kommt, sondern mit Geduld und Fürsorge."
        }
    ],
    korean: [
        {
            id: 13,
            title: "태양의 선물",
            level: "Beginner",
            duration: "5 min read",
            description: "The sun's gift to the world.",
            content: "해는 매일 아침 하늘에서 떠올랐습니다. 그것은 세상을 밝히고 모든 생명에 에너지를 주었습니다. 작은 씨앗은 태양의 빛을 받아 자라났습니다. 나무가 되었을 때, 그 나무는 다른 씨앗에게 그늘을 제공했습니다. 태양의 선물은 계속 순환되었습니다."
        },
        {
            id: 14,
            title: "손으로 만든 기억",
            level: "Intermediate",
            duration: "8 min read",
            description: "Memories created by hand and heart.",
            content: "할머니는 손으로 모든 것을 만드셨습니다. 옷, 음식, 그리고 추억들. 그녀의 손은 주름이 많았지만, 모든 주름에는 사랑의 흔적이 있었습니다. 손녀는 할머니의 손을 잡으면 안전함을 느꼈습니다. 나중에 손녀는 자신의 손으로 미래 세대를 위해 무언가를 만들기로 결심했습니다. 그렇게 사랑은 손에서 손으로 전해집니다."
        },
        {
            id: 15,
            title: "도시의 작은 카페",
            level: "Intermediate",
            duration: "10 min read",
            description: "A small cafe in the city where souls meet.",
            content: "서울의 골목길에는 작은 카페가 있었습니다. 여기서는 낯선 사람들이 친구가 되었습니다. 주인은 각 손님의 이름을 기억하고, 그들의 이야기를 들었습니다. 사무직 근로자, 학생, 노인, 모두가 이곳을 찾았습니다. 카페는 단순한 음료의 장소가 아니라, 마음의 쉼터였습니다. 사람들은 여기서 자신이 혼자가 아니라는 것을 느꼈습니다."
        }
    ],
    italian: [
        {
            id: 16,
            title: "Il Ragazzo e la Stella",
            level: "Beginner",
            duration: "5 min read",
            description: "A boy and his special star.",
            content: "Un piccolo ragazzo viveva in una casa con una grande finestra. Ogni notte guardava il cielo e trovava la sua stella preferita. Le sussurrava i suoi segreti e i suoi sogni. La stella brillava più luminosa quando il ragazzo le parlava. Crescendo, il ragazzo si ricordava della stella come di una vera amica."
        },
        {
            id: 17,
            title: "Il Viaggio della Tartaruga",
            level: "Intermediate",
            duration: "8 min read",
            description: "A turtle's journey across mountains and valleys.",
            content: "Una tartaruga lenta cominciò il suo lungo viaggio attraverso il mondo. Tutti le dicevano che non poteva farcela, ma lei continuava comunque. Attraversò montagne, valli e fiumi. Lungo il cammino, incontrò molti animali. Ogni incontro le insegnava qualcosa di nuovo. Dopo molti anni, quando finalmente raggiunse l'oceano, capì che il viaggio stesso era stato il vero regalo, non la destinazione."
        },
        {
            id: 18,
            title: "La Ricetta Segreta",
            level: "Intermediate",
            duration: "10 min read",
            description: "A grandmother's secret recipe holds more than ingredients.",
            content: "La nonna di Maria aveva una ricetta segreta per il pane toscano. Maria le chiedeva sempre quale fosse il segreto, ma la nonna sorrideva e diceva: 'Amore'. Maria non comprendeva fino a quando la nonna diventò troppo anziana per cucinare. Poi Maria fece il pane seguendo esattamente la ricetta, ma sapeva che mancava qualcosa. Realizzò che il vero ingrediente era il tempo trascorso insieme, la pazienza, e l'amore messo in ogni impasto. Questa lezione trasformò non solo il pane, ma la vita di Maria."
        }
    ],
    chinese: [
        {
            id: 19,
            title: "小莲的梦想",
            level: "Beginner",
            duration: "5 min read",
            description: "Small lotus's dream to bloom.",
            content: "小莲是一个小莲花，生长在污泥中。每天，她看着阳光穿过水面，梦想有一天也能浮出水面。其他的莲花告诉她这不可能，但小莲继续努力。终于有一天，她浮出了水面，开放了最美丽的花朵。她明白了，只要坚持，再深的泥沼也无法阻止我们绽放。"
        },
        {
            id: 20,
            title: "茶杯里的禅",
            level: "Intermediate",
            duration: "8 min read",
            description: "Zen wisdom found in a tea cup.",
            content: "一位老茶艺师为学生倒茶。他说：'看这杯茶。它从一片叶子开始，经历沸水，被压制，却最终释放出最美的香气。'学生明白了，人生中的困难和挑战就像那沸水，它们并不破坏我们，反而让我们释放出最好的自己。"
        },
        {
            id: 21,
            title: "村里的故事",
            level: "Intermediate",
            duration: "10 min read",
            description: "Stories woven through a village's generations.",
            content: "在一个小村子里，每个家族都有自己的故事。祖父母把故事传给父母，父母传给孩子。这些故事不仅是历史，更是爱的传承。一个女孩收集了整个村子的故事，写成了一本书。通过这本书，整个世界都了解到了这个小村子的温暖和智慧。故事的力量，就是让我们所爱的人永远活在心中。"
        }
    ],
    portuguese: [
        {
            id: 22,
            title: "A Menina do Rio",
            level: "Beginner",
            duration: "5 min read",
            description: "A girl who found magic by the river.",
            content: "Cada dia, uma menina corria para o rio perto de sua casa. Ela se sentava na margem e observava a água fluir. O rio lhe sussurrava histórias antigas. A menina aprendeu que, como o rio, ela também poderia fluir através da vida, encontrando seu próprio caminho. Essa lição a acompanhou por toda a vida."
        },
        {
            id: 23,
            title: "O Jardim da Esperança",
            level: "Intermediate",
            duration: "8 min read",
            description: "Hope blooms in an unexpected garden.",
            content: "Após uma perda grande, uma mulher começou a plantar sementes em um terreno vazio. Meses passaram e nenhuma flor brotou. Mas ela continuava plantando e aguando. Um dia, uma pequena flor amarela apareceu. Depois vieram mais. Em poucos meses, o terreno vazio virou um jardim colorido. Pessoas do bairro começaram a vir, e suas histórias mudaram. O que começou como um ato de esperança se tornou um lugar de cura comunitária."
        },
        {
            id: 24,
            title: "Vozes do Passado",
            level: "Intermediate",
            duration: "10 min read",
            description: "Listening to the voices of our ancestors.",
            content: "Uma rapariga descobriu uma caixa antiga na casa de sua avó. Dentro havia cartas de seus antepassados. Ao ler cada carta, ela ouviu as vozes de pessoas que viveram há séculos. Suas alegrias, lutas e esperanças ecoavam através do tempo. Ela percebeu que ella era o resultado de todas essas histórias e esperanças. Com esse conhecimento, ela entendeu seu lugar no mundo e a responsabilidade de contar essas histórias para a próxima geração."
        }
    ],
    hindi: [
        {
            id: 25,
            title: "चाँद की कहानी",
            level: "Beginner",
            duration: "5 min read",
            description: "The moon's nightly journey and purpose.",
            content: "चाँद हर रात आकाश में उगता है और दुनिया को रोशनी देता है। वह अपने काम को चुपचाप, बिना किसी प्रशंसा के करता है। एक बालक चाँद से कहता है, 'आप इतना अकेला क्यों हैं?' चाँद हँसता है और कहता है, 'अकेला नहीं बेटा, मैं लाखों लोगों के साथ हूँ जो मुझे देख रहे हैं।'"
        },
        {
            id: 26,
            title: "दादी की विरासत",
            level: "Intermediate",
            duration: "8 min read",
            description: "A grandmother's legacy of wisdom and love.",
            content: "एक दादी अपनी पोती को सिखाती हैं कि कैसे खीर बनाएं। यह केवल एक नुस्खा नहीं है, बल्कि प्यार की कला है। हर चम्मच में, हर सामग्री में, हर आँच में प्यार होना चाहिए। साल बाद, जब पोती अपनी बेटी को खीर बनाती है, तो वह अपनी दादी की आत्मा को महसूस करती है। रसोई में, पीढ़ियाँ मिलती हैं।"
        },
        {
            id: 27,
            title: "बगीचे का संदेश",
            level: "Intermediate",
            duration: "10 min read",
            description: "What a garden teaches us about life and growth.",
            content: "एक आदमी अपने बगीचे में हर प्रकार के पौधे लगाता है। कुछ जल्दी खिलते हैं, कुछ को वर्षों लगते हैं। वह सीखता है कि धैर्य महत्वपूर्ण है। कुछ पौधों को तूफान आता है और वे टूट जाते हैं। लेकिन वे फिर से बढ़ते हैं, मजबूत होकर। बगीचे ने उसे जीवन की सबसे महत्वपूर्ण सीख दी: हर चीज का अपना समय है, और धैर्य ही सफलता की कुंजी है।"
        }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const section = e.target.dataset.section;
            switchSection(section);
        });
    });

    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', openAuthModal);
    document.getElementById('signupBtn').addEventListener('click', () => {
        openAuthModal();
        switchAuthTab('signup');
    });
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);

    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchAuthTab(tabName);
        });
    });

    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContact);

    // Language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectLanguage(e.target.dataset.language);
        });
    });

    // Submit story form
    document.getElementById('submitStoryForm').addEventListener('submit', handleSubmitStory);
}

// Section Navigation
function switchSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    const section = document.getElementById(sectionName);
    if (section) {
        section.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// Language Selection
function selectLanguage(language) {
    currentLanguage = language;
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load stories for this language
    loadStories(language);
    
    // Show stories view
    document.querySelector('.languages-grid').classList.add('hidden');
    document.getElementById('storiesView').classList.remove('hidden');
    document.getElementById('selectedLanguage').textContent = 
        language.charAt(0).toUpperCase() + language.slice(1);
}

function showLanguages() {
    document.querySelector('.languages-grid').classList.remove('hidden');
    document.getElementById('storiesView').classList.add('hidden');
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}

// Load and Display Stories
function loadStories(language) {
    const stories = storyDatabase[language] || [];
    const storiesGrid = document.getElementById('storiesGrid');
    storiesGrid.innerHTML = '';
    
    stories.forEach(story => {
        const storyCard = document.createElement('div');
        storyCard.className = 'story-card';
        storyCard.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.description}</p>
            <div class="story-meta-small">
                <span>📚 ${story.level}</span>
                <span>⏱️ ${story.duration}</span>
            </div>
        `;
        storyCard.addEventListener('click', () => openStoryModal(story));
        storiesGrid.appendChild(storyCard);
    });
}

// Story Modal
function openStoryModal(story) {
    currentStory = story;
    document.getElementById('storyTitle').textContent = story.title;
    document.getElementById('storyLevel').textContent = `📚 Level: ${story.level}`;
    document.getElementById('storyDuration').textContent = `⏱️ ${story.duration}`;
    document.getElementById('storyBody').textContent = story.content;
    
    // Update enroll button
    const enrollBtn = document.getElementById('enrollBtn');
    if (authToken) {
        enrollBtn.textContent = 'Start Reading';
        enrollBtn.disabled = false;
    } else {
        enrollBtn.textContent = 'Login to Start Reading';
        enrollBtn.disabled = false;
    }
    
    document.getElementById('storyModal').classList.remove('hidden');
}

function closeStoryModal() {
    document.getElementById('storyModal').classList.add('hidden');
}

function enrollCourse() {
    if (!authToken) {
        openAuthModal();
        return;
    }
    
    // In a real app, this would call the API
    alert(`Great! You've started reading "${currentStory.title}". Enjoy the story! 📖`);
    closeStoryModal();
}

// Submit Story Modal
function openSubmitStoryModal() {
    if (!authToken) {
        alert('Please login to submit a story');
        openAuthModal();
        return;
    }
    document.getElementById('submitStoryModal').classList.remove('hidden');
}

function closeSubmitStoryModal() {
    document.getElementById('submitStoryModal').classList.add('hidden');
    document.getElementById('submitStoryForm').reset();
}

// Auth Modal
function openAuthModal() {
    document.getElementById('authModal').classList.remove('hidden');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
}

function switchAuthTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    document.querySelector(`.auth-tab[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Form`).classList.add('active');
}

// Authentication Handlers
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageEl = document.getElementById('loginMessage');
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.user;
            updateAuthUI();
            closeAuthModal();
            messageEl.textContent = '';
            document.getElementById('loginForm').reset();
        } else {
            messageEl.textContent = data.error || 'Login failed';
            messageEl.className = 'form-message error';
        }
    } catch (error) {
        messageEl.textContent = 'Network error. Please try again.';
        messageEl.className = 'form-message error';
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const messageEl = document.getElementById('signupMessage');
    
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            localStorage.setItem('authToken', authToken);
            currentUser = data.user;
            updateAuthUI();
            closeAuthModal();
            messageEl.textContent = '';
            document.getElementById('signupForm').reset();
        } else {
            messageEl.textContent = data.error || 'Signup failed';
            messageEl.className = 'form-message error';
        }
    } catch (error) {
        messageEl.textContent = 'Network error. Please try again.';
        messageEl.className = 'form-message error';
    }
}

function logout() {
    authToken = null;
    localStorage.removeItem('authToken');
    currentUser = null;
    updateAuthUI();
}

function loadUser() {
    if (authToken) {
        fetch(`${API_BASE}/user`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        })
        .then(res => res.json())
        .then(data => {
            if (data.username) {
                currentUser = data;
                updateAuthUI();
            }
        })
        .catch(() => {
            authToken = null;
            localStorage.removeItem('authToken');
        });
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    
    if (authToken && currentUser) {
        loginBtn.classList.add('hidden');
        signupBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        userInfo.classList.remove('hidden');
        userInfo.textContent = `Welcome, ${currentUser.username}!`;
    } else {
        loginBtn.classList.remove('hidden');
        signupBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        userInfo.classList.add('hidden');
    }
}

// Contact Form Handler
async function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    try {
        const response = await fetch(`${API_BASE}/contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Thank you for your message! We\'ll be in touch soon.');
            document.getElementById('contactForm').reset();
        } else {
            alert('Failed to send message. Please try again.');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

// Submit Story Handler
async function handleSubmitStory(e) {
    e.preventDefault();
    const messageEl = document.getElementById('submitStoryMessage');
    
    const title = document.getElementById('storyTitle').value;
    const language = document.getElementById('storyLanguage').value;
    const level = document.getElementById('storyLevel').value;
    const description = document.getElementById('storyDescription').value;
    const content = document.getElementById('storyContent').value;
    
    try {
        const response = await fetch(`${API_BASE}/stories/submit`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ title, language, level, content, description })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageEl.textContent = '✅ Story submitted successfully! Waiting for approval.';
            messageEl.className = 'form-message success';
            document.getElementById('submitStoryForm').reset();
            setTimeout(() => {
                closeSubmitStoryModal();
            }, 2000);
        } else {
            messageEl.textContent = data.error || 'Failed to submit story';
            messageEl.className = 'form-message error';
        }
    } catch (error) {
        messageEl.textContent = 'Network error. Please try again.';
        messageEl.className = 'form-message error';
    }
}
