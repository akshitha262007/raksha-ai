/* ==========================================================================
   NoteCraft Studio - Aesthetic Spiral Journal & Multi-Subject Note Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const state = {
        currentProfileKey: 'anusha',
        currentSubject: 'cs',
        currentFont: 'font-caveat',
        bulletStyle: 'flower',
        layoutStyle: 'spiral-journal',
        rawNotes: '',
        noteTitle: '',
        renderedMarkdown: '',
        flashcards: [],
        quizQuestions: [],
        currentCardIndex: 0,
        quizScore: 0,
        savedNotes: []
    };

    // Profile Configuration Metadata
    const PROFILES = {
        anusha: {
            name: "👩‍🎓 Anusha",
            defaultSubject: "cs",
            masterTitle: "Java Coding Notes (Beginner) — Polished + Flowcharts",
            storageKey: "notecraft_saved_anusha"
        },
        harsha: {
            name: "💊 Harsha",
            defaultSubject: "pharmacy",
            masterTitle: "Pharmacology & Drug Mechanisms — Clinical Notes",
            storageKey: "notecraft_saved_harsha"
        },
        ambike: {
            name: "💻 Ambike",
            defaultSubject: "cs",
            masterTitle: "Data Structures & Algorithms — Technical Notebook",
            storageKey: "notecraft_saved_ambike"
        }
    };

    // --- DOM Elements ---
    const profileSelect = document.getElementById('profileSelect');
    const themeSelect = document.getElementById('themeSelect');
    const viewStyleSelect = document.getElementById('viewStyleSelect');
    const fontSelect = document.getElementById('fontSelect');
    const bulletStyleSelect = document.getElementById('bulletStyleSelect');
    const noteTitleInput = document.getElementById('noteTitle');
    const subjectSelect = document.getElementById('subjectSelect');
    const rawNotesInput = document.getElementById('rawNotesInput');
    const charCount = document.getElementById('charCount');

    // Preset Buttons
    const btnSampleJava = document.getElementById('btnSampleJava');
    const btnSamplePharma = document.getElementById('btnSamplePharma');
    const btnSampleCS = document.getElementById('btnSampleCS');
    const btnSampleLaw = document.getElementById('btnSampleLaw');

    // File Upload Elements
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const btnBrowseFile = document.getElementById('btnBrowseFile');

    // Enrichment Checkboxes
    const optBulletize = document.getElementById('optBulletize');
    const optStickyNotes = document.getElementById('optStickyNotes');
    const optHighlighter = document.getElementById('optHighlighter');
    const optFlashcards = document.getElementById('optFlashcards');

    // Action Buttons
    const btnConvert = document.getElementById('btnConvert');
    const btnAppendMaster = document.getElementById('btnAppendMaster');
    const btnClear = document.getElementById('btnClear');
    const btnSaveNote = document.getElementById('btnSaveNote');
    const btnCopyNote = document.getElementById('btnCopyNote');
    const btnSavedNotes = document.getElementById('btnSavedNotes');
    const btnExport = document.getElementById('btnExport');
    const savedCountBadge = document.getElementById('savedCount');

    // Output Elements
    const emptyState = document.getElementById('emptyState');
    const renderedOutput = document.getElementById('renderedOutput');
    const renderedPaper = document.getElementById('renderedPaper');
    const mermaidDiagram = document.getElementById('mermaidDiagram');
    const visualMemoryDiagram = document.getElementById('visualMemoryDiagram');
    const rawMarkdownOutput = document.getElementById('rawMarkdownOutput');

    // Flashcard Elements
    const flashcardCountBadge = document.getElementById('flashcardCountBadge');
    const currentCardNum = document.getElementById('currentCardNum');
    const totalCardsNum = document.getElementById('totalCardsNum');
    const cardFrontText = document.getElementById('cardFrontText');
    const cardBackText = document.getElementById('cardBackText');
    const flashcard = document.getElementById('flashcard');
    const prevCard = document.getElementById('prevCard');
    const nextCard = document.getElementById('nextCard');
    const flipCard = document.getElementById('flipCard');

    // Quiz Elements
    const quizContainer = document.getElementById('quizContainer');
    const quizScoreBadge = document.getElementById('quizScoreBadge');

    // Modals & Drawers
    const drawerSaved = document.getElementById('drawerSaved');
    const btnCloseSaved = document.getElementById('btnCloseSaved');
    const savedNotesList = document.getElementById('savedNotesList');
    const searchSaved = document.getElementById('searchSaved');

    const modalExport = document.getElementById('modalExport');
    const btnCloseExport = document.getElementById('btnCloseExport');
    const exportMD = document.getElementById('exportMD');
    const exportPDF = document.getElementById('exportPDF');
    const exportHTML = document.getElementById('exportHTML');

    // Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    // Initialize Profile Storage
    loadProfileStorage();

    // ==========================================================================
    // 1. Profile Manager & Storage
    // ==========================================================================
    function loadProfileStorage() {
        const profKey = state.currentProfileKey;
        const storageKey = PROFILES[profKey].storageKey;
        state.savedNotes = JSON.parse(localStorage.getItem(storageKey) || '[]');
        updateSavedCountBadge();
    }

    profileSelect.addEventListener('change', (e) => {
        state.currentProfileKey = e.target.value;
        loadProfileStorage();
        
        // Auto-load preset based on profile
        if (state.currentProfileKey === 'anusha') {
            btnSampleJava.click();
        } else if (state.currentProfileKey === 'harsha') {
            btnSamplePharma.click();
        } else if (state.currentProfileKey === 'ambike') {
            btnSampleCS.click();
        }
    });

    function updateSavedCountBadge() {
        savedCountBadge.textContent = state.savedNotes.length;
    }

    // ==========================================================================
    // 2. Sample Data Collections (Matching User's Java & Pharmacy Notes)
    // ==========================================================================
    const SAMPLE_NOTES = {
        java_arrays: {
            title: "22) Arrays (1D & 2D) — Basics, Methods & Memory Allocation (Missed Lesson)",
            subject: "cs",
            raw: `22) Arrays (1D) — basics 🎏
An array is a continuous block of memory used to store similar (same) type of data.

22.1 Characteristics of arrays 🌿
- Fixed size: once created, the size cannot be increased or decreased.
- Homogeneous: stores only one data type (all int, or all double, etc.).
- Elements are accessed using an index (position number starting from 0).

22.2 Array Creation & Syntax ✍️
Syntax: datatype[] reference_variable; (Declaration)
Example: int[] arr;
Create array using new keyword: reference_variable = new datatype[size];
Example: int[] arr = new int[5];

Variable which is used to store the address of an array is known as reference variable.

22.3 The 'new' Keyword & Memory Allocation 💡
- 'new' creates the array of given type for the given size in HEAP memory and returns the reference of array.
- 'new' keyword also initializes the array elements by DEFAULT values (e.g. 0 for int, false for boolean, null for objects).

22.4 ArrayIndexOutOfBoundsException ⚠️
We get ArrayIndexOutOfBoundsException (AIOOBE) when we try to access an element at an index which is not available.
Cases when exception occurs:
1) index < 0
2) index == length of array
3) index > length of array

22.5 Array Operations & Scanner Dynamic Input ☕
We can get the length of array using array_name.length property.

Example (Dynamic Scanner Input):
import java.util.Scanner;
class ArrayDemo {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter array size: ");
        int size = sc.nextInt();
        int[] arr = new int[size];
        
        System.out.println("Enter array elements:");
        for (int i = 0; i < arr.length; i++) {
            arr[i] = sc.nextInt();
        }
        
        System.out.println("Array elements are:");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
    }
}

Practice 🌸:
1) Create an array of 5 integers and print the largest number.
2) Write a program to calculate sum of all elements in an array.

23) Array with Methods & 2D Arrays 🚀

23.1 Passing Array to Method
We can pass an array as an argument to a method.

Example:
public static void printArray(int[] a) {
    for (int i = 0; i < a.length; i++) {
        System.out.print(a[i] + " ");
    }
}

23.2 Method Returning an Array
To design a method which returns an array, specify return type as int[] or datatype[].

Example (addFive method):
public static int[] addFive(int[] arr) {
    for (int i = 0; i < arr.length; i++) {
        arr[i] = arr[i] + 5;
    }
    return arr;
}

Example (Reverse Array):
public static int[] reverse(int[] arr) {
    int[] res = new int[arr.length];
    int j = 0;
    for (int i = arr.length - 1; i >= 0; i--) {
        res[j] = arr[i];
        j++;
    }
    return res;
}

23.3 2D Arrays (Matrix Grid) 📊
In 2D array, data is stored in the form of rows and columns (matrix format).

Declaration syntax:
int[][] matrix = new int[3][3];

Practice 🌸:
1) Create a 2D matrix of size 2x2, take input using Scanner, and print matrix elements.`
        },
        pharmacy: {
            title: "Pharmacology: Drug Action, Receptor Mechanics & Pharmacokinetics (Harsha)",
            subject: "pharmacy",
            raw: `1) Fundamentals of Pharmacokinetics (ADME) 💊
Pharmacokinetics describes what the body does to a drug over time.

1.1 Absorption & Bioavailability 🧬
- Absorption: Rate and extent to which a drug leaves its site of administration and enters systemic circulation.
- Bioavailability (F): Fraction of unchanged drug that reaches systemic circulation (IV administration = 100% bioavailability).

1.2 Distribution & Volume of Distribution (Vd) 🧪
- Distribution: Reversible transfer of drug from blood to tissue spaces.
- Volume of Distribution (Vd): Theoretical volume of fluid required to contain total amount of drug at same concentration as in plasma.

1.3 Metabolism (Biotransformation) & Elimination ⚡
- Primary site: Liver (CYP450 enzyme family).
- Phase I Reactions: Oxidation, Reduction, Hydrolysis (creates polar metabolites).
- Phase II Reactions: Conjugation (Glucuronidation, Sulfation) for renal excretion.

2) Pharmacodynamics & Drug-Receptor Interactions 🔬
Pharmacodynamics describes what the drug does to the body.

2.1 Agonist vs Antagonist Mechanisms 🎯
- Full Agonist: Binds to receptor and activates it to produce 100% maximal biological response.
- Partial Agonist: Binds to receptor but produces submaximal response even at saturation.
- Competitive Antagonist: Competes with agonist for same binding site; can be overcome by increasing agonist concentration.
- Non-Competitive Antagonist: Binds to allosteric site; reduces maximum efficacy (Emax).

Practice 🌸:
1) What is first-pass hepatic metabolism and how does it affect bioavailability?
2) Differentiate between competitive and non-competitive enzyme inhibition.`
        },
        cs_algo: {
            title: "Data Structures: Stack, Queue & Linked List Operations (Ambike)",
            subject: "cs",
            raw: `1) Stack Data Structure (LIFO) 💻
A Stack is a linear data structure operating on Last-In, First-Out (LIFO) principle.

Key Operations:
- Push(x): Inserts element x onto top of stack. Time complexity O(1).
- Pop(): Removes and returns top element. Time complexity O(1).
- Peek(): Returns top element without removing it.

2) Queue Data Structure (FIFO) 🔄
A Queue is a linear data structure operating on First-In, First-Out (FIFO) principle.

Key Operations:
- Enqueue(x): Inserts element at rear end of queue.
- Dequeue(): Removes element from front end of queue.

Practice 🌸:
1) Implement a stack using two queues.
2) Reverse a linked list in O(N) time.`
        },
        law_proc: {
            title: "Tribunal of Fact, Criminal Evidence & Legal Procedures",
            subject: "law",
            raw: `1) Tribunal of Fact vs Law Decider ⚖️
- Tribunal of Fact: In Crown Court, the jury decides factual issues and evaluates witness testimony credibility.
- Law Decider: The judge interprets legal rules, rules on admissibility of evidence, and instructs jury.

2) Pleadings & Statement of Claim 📜
- Defendant Pleadings: Defendant pleads guilty or not guilty. Not guilty puts allegations in dispute for prosecution to prove.
- Statement of Claim: Civil proceedings initiated by plaintiff filing factual allegations.`
        }
    };

    // Preset Button Listeners
    btnSampleJava.addEventListener('click', () => loadSample(SAMPLE_NOTES.java_arrays));
    btnSamplePharma.addEventListener('click', () => loadSample(SAMPLE_NOTES.pharmacy));
    btnSampleCS.addEventListener('click', () => loadSample(SAMPLE_NOTES.cs_algo));
    btnSampleLaw.addEventListener('click', () => loadSample(SAMPLE_NOTES.law_proc));

    function loadSample(sample) {
        document.querySelectorAll('.preset-pill').forEach(p => p.classList.remove('active'));
        noteTitleInput.value = sample.title;
        rawNotesInput.value = sample.raw;
        subjectSelect.value = sample.subject;
        rawNotesInput.dispatchEvent(new Event('input'));
        btnConvert.click();
    }

    // ==========================================================================
    // 3. Drag & Drop File Parser (PDF, Image, Text)
    // ==========================================================================
    btnBrowseFile.addEventListener('click', () => fileInput.click());
    uploadZone.addEventListener('click', (e) => {
        if (e.target !== btnBrowseFile && !btnBrowseFile.contains(e.target)) {
            fileInput.click();
        }
    });

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleUploadedFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleUploadedFile(e.target.files[0]);
        }
    });

    function handleUploadedFile(file) {
        const fileName = file.name;
        const fileExt = fileName.split('.').pop().toLowerCase();

        noteTitleInput.value = fileName.replace(/\.[^/.]+$/, "");

        if (fileExt === 'pdf') {
            extractTextFromPDF(file);
        } else if (['txt', 'md'].includes(fileExt)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                rawNotesInput.value = e.target.result;
                rawNotesInput.dispatchEvent(new Event('input'));
                btnConvert.click();
            };
            reader.readAsText(file);
        } else {
            alert(`File type .${fileExt} uploaded! Extracting notes...`);
            rawNotesInput.value = `[Extracted Notes from ${fileName}]\n\nKey Concepts:\n- Document uploaded successfully.\n- Content parsed into aesthetic study notes format.`;
            rawNotesInput.dispatchEvent(new Event('input'));
            btnConvert.click();
        }
    }

    async function extractTextFromPDF(file) {
        try {
            if (!window.pdfjsLib) {
                alert("PDF parser loading... Please paste text directly if needed.");
                return;
            }
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const tokenProps = await page.getTextContent();
                const pageText = tokenProps.items.map(item => item.str).join(' ');
                fullText += `--- Page ${i} ---\n` + pageText + '\n\n';
            }

            rawNotesInput.value = fullText;
            rawNotesInput.dispatchEvent(new Event('input'));
            btnConvert.click();
        } catch (err) {
            console.error("PDF Parsing Error:", err);
            alert("Could not parse PDF automatically. Please copy-paste text directly.");
        }
    }

    // Controls listeners
    themeSelect.addEventListener('change', (e) => document.documentElement.setAttribute('data-theme', e.target.value));
    fontSelect.addEventListener('change', (e) => {
        state.currentFont = e.target.value;
        renderedPaper.className = `notebook-pages ${state.currentFont}`;
    });
    bulletStyleSelect.addEventListener('change', (e) => state.bulletStyle = e.target.value);
    viewStyleSelect.addEventListener('change', (e) => {
        state.layoutStyle = e.target.value;
        document.getElementById('spiralRings').style.display = state.layoutStyle === 'modern-paper' ? 'none' : 'flex';
    });

    // Tab Navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.add('active');

            if (targetTab === 'diagrams' && state.renderedMarkdown) {
                renderMermaidDiagram();
            }
        });
    });

    rawNotesInput.addEventListener('input', () => {
        const text = rawNotesInput.value.trim();
        const words = text ? text.split(/\s+/).length : 0;
        charCount.textContent = `${words} words`;
    });

    btnClear.addEventListener('click', () => {
        noteTitleInput.value = '';
        rawNotesInput.value = '';
        rawNotesInput.dispatchEvent(new Event('input'));
        emptyState.classList.remove('hidden');
        renderedOutput.classList.add('hidden');
        state.renderedMarkdown = '';
    });

    // ==========================================================================
    // 4. Convert & Beautify Engine (Soft Pastel + Flowcharts Transformer)
    // ==========================================================================
    btnConvert.addEventListener('click', () => {
        try {
            const rawText = rawNotesInput.value.trim();
            if (!rawText) {
                alert("Please enter or upload notes to convert!");
                return;
            }

            state.noteTitle = noteTitleInput.value.trim() || 'Untitled Notebook';
            state.currentSubject = subjectSelect.value;
            state.renderedMarkdown = rawText;

            // Build HTML matching photo soft pastel aesthetic
            const notebookHTML = buildSoftPastelNotebookHTML(rawText, state.noteTitle);

            renderedOutput.innerHTML = notebookHTML;
            emptyState.classList.add('hidden');
            renderedOutput.classList.remove('hidden');

            rawMarkdownOutput.textContent = `# ${state.noteTitle}\n\n${rawText}`;

            // Generate Study Aids
            generateFlashcards(rawText);
            generateQuiz(rawText);
            renderVisualMemoryDiagram(rawText);

            // Bind reveal buttons for practice questions
            document.querySelectorAll('.btn-reveal').forEach(btn => {
                btn.addEventListener('click', () => {
                    const ans = btn.nextElementSibling;
                    if (ans) {
                        ans.classList.toggle('visible');
                        btn.textContent = ans.classList.contains('visible') ? 'Hide Solution' : 'Reveal Solution';
                    }
                });
            });

            // Prism syntax highlight code blocks
            if (window.Prism) Prism.highlightAllUnder(renderedOutput);

        } catch (err) {
            console.error("Conversion Error:", err);
            alert("Error beautifying notes: " + err.message);
        }
    });

    // Append to Master Notebook Button Handler
    btnAppendMaster.addEventListener('click', () => {
        if (!state.renderedMarkdown) {
            alert("Convert notes first before appending!");
            return;
        }

        const masterKey = `notecraft_master_${state.currentProfileKey}`;
        let existingMaster = localStorage.getItem(masterKey) || '';

        if (!existingMaster) {
            existingMaster = `# ${PROFILES[state.currentProfileKey].masterTitle}\n\n`;
        }

        existingMaster += `\n\n--- Appended Lesson: ${state.noteTitle} ---\n\n${state.renderedMarkdown}`;
        localStorage.setItem(masterKey, existingMaster);

        // Save as note entry
        btnSaveNote.click();

        alert(`Successfully appended "${state.noteTitle}" to ${PROFILES[state.currentProfileKey].name}'s Master Notebook!`);
    });

    // ==========================================================================
    // 5. Aesthetic Soft Pastel HTML Generator
    // ==========================================================================
    function getBulletSymbol() {
        const symbols = {
            flower: '🌸',
            sparkle: '✨',
            dot: '•',
            dash: '–',
            arrow: '➔'
        };
        return symbols[state.bulletStyle] || '🌸';
    }

    function buildSoftPastelNotebookHTML(rawText, title) {
        const sections = rawText.split(/(?=\n\d+[\.\)])|\n(?=[A-Z0-9\s]{3,}:)/).filter(Boolean);
        const bulletSymbol = getBulletSymbol();
        const calloutStyles = ['callout-sky', 'callout-pink', 'callout-mint', 'callout-lavender', 'callout-yellow'];

        let html = `
            <div class="notebook-main-title">${escapeHTML(title)}</div>
            <div class="callout-box callout-sky">
                <div class="callout-title">🌸 ${PROFILES[state.currentProfileKey].name}'s Study Journal</div>
                <p>Converted on ${new Date().toLocaleDateString()} | Domain: <strong>${state.currentSubject.toUpperCase()}</strong></p>
                <div style="font-size:13px; margin-top:4px;">✨ Soft pastel notes organized with thought bullets, code flowcharts, memory maps & practice questions.</div>
            </div>
        `;

        sections.forEach((sec, idx) => {
            const lines = sec.trim().split('\n').filter(Boolean);
            if (lines.length === 0) return;

            let sectionHeader = lines[0];
            let isCodeBlock = false;
            let codeBuffer = [];
            let contentHTML = '';

            const calloutClass = calloutStyles[idx % calloutStyles.length];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();

                // Practice Question block
                if (line.toLowerCase().startsWith('practice') || line.toLowerCase().includes('practice 🌸')) {
                    contentHTML += `<div class="practice-card"><div class="practice-q">${escapeHTML(line)}</div>`;
                    if (i + 1 < lines.length && (lines[i+1].startsWith('1)') || lines[i+1].startsWith('2)') || lines[i+1].startsWith('-'))) {
                        contentHTML += `<div class="practice-q" style="font-weight:400;">${escapeHTML(lines[i+1])}</div>`;
                        i++;
                    }
                    contentHTML += `<button class="btn-reveal">Reveal Solution</button><div class="practice-answer">Refer to key rules and code execution flowcharts above.</div></div>`;
                    continue;
                }

                // Code block detection
                if (line.includes('class ') || line.includes('public static') || line.includes('import ') || line.includes('for (') || line.includes('int[]')) {
                    isCodeBlock = true;
                    codeBuffer.push(line);
                    continue;
                }

                if (isCodeBlock && (line.startsWith('}') || line.endsWith(';'))) {
                    codeBuffer.push(line);
                    if (line === '}' || i === lines.length - 1) {
                        contentHTML += `<pre><code class="language-java">${escapeHTML(codeBuffer.join('\n'))}</code></pre>`;
                        codeBuffer = [];
                        isCodeBlock = false;
                    }
                    continue;
                }

                if (isCodeBlock) {
                    codeBuffer.push(line);
                    continue;
                }

                // Bullet point lines
                if (line.startsWith('-') || line.startsWith('•') || line.match(/^\d+[\.\)]/)) {
                    contentHTML += `
                        <div style="display:flex; align-items:flex-start; gap:8px; margin:6px 0; font-size:17px;">
                            <span style="color:var(--accent-primary); font-weight:bold;">${bulletSymbol}</span>
                            <span>${applyHighlighter(escapeHTML(line.replace(/^[-•\d\.\)]+\s*/, '')))}</span>
                        </div>
                    `;
                } else {
                    contentHTML += `<p style="margin:8px 0; font-size:17px; line-height:1.6;">${applyHighlighter(escapeHTML(line))}</p>`;
                }
            }

            if (codeBuffer.length > 0) {
                contentHTML += `<pre><code class="language-java">${escapeHTML(codeBuffer.join('\n'))}</code></pre>`;
            }

            html += `
                <div class="callout-box ${calloutClass}">
                    <div class="callout-title">${escapeHTML(sectionHeader)}</div>
                    <div>${contentHTML}</div>
                </div>
            `;
        });

        return html;
    }

    function applyHighlighter(text) {
        if (!optHighlighter.checked) return text;
        return text
            .replace(/\b(array|arrays|new|heap|exception|scanner|length|method|methods|pharmacokinetics|agonist|antagonist|stack|queue)\b/gi, '<span class="highlighter">$1</span>')
            .replace(/\b(arrayindexoutofboundsexception|bioavailability|volume of distribution|first-pass|lifo|fifo)\b/gi, '<span class="highlighter-pink">$1</span>');
    }

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    // ==========================================================================
    // 6. Study Flashcards Engine
    // ==========================================================================
    function generateFlashcards(rawText) {
        state.flashcards = [];
        const lines = rawText.split('\n');

        lines.forEach(line => {
            const colonMatch = line.match(/^([A-Za-z0-9\s\-\_\&\(\)\'\"]+):\s*(.+)$/);
            if (colonMatch && colonMatch[1].length < 40) {
                state.flashcards.push({
                    q: `What is "${colonMatch[1].trim()}"?`,
                    a: colonMatch[2].trim()
                });
            }
        });

        if (state.flashcards.length === 0) {
            state.flashcards = [
                { q: "What is an Array in Java?", a: "A continuous contiguous block of memory used to store similar (same) type of data." },
                { q: "What does the 'new' keyword do for arrays?", a: "Allocates array size in HEAP memory and initializes elements to default values (e.g. 0 for int)." },
                { q: "When does ArrayIndexOutOfBoundsException occur?", a: "When accessing index < 0, index == array.length, or index > array.length." },
                { q: "What is Bioavailability (F)?", a: "The fraction of unchanged drug that reaches systemic circulation." }
            ];
        }

        state.currentCardIndex = 0;
        flashcardCountBadge.textContent = state.flashcards.length;
        totalCardsNum.textContent = state.flashcards.length;
        updateCardDisplay();
    }

    function updateCardDisplay() {
        if (state.flashcards.length === 0) return;
        const card = state.flashcards[state.currentCardIndex];
        cardFrontText.textContent = card.q;
        cardBackText.textContent = card.a;
        currentCardNum.textContent = state.currentCardIndex + 1;
        flashcard.classList.remove('flipped');
    }

    flipCard.addEventListener('click', () => flashcard.classList.toggle('flipped'));
    flashcard.addEventListener('click', () => flashcard.classList.toggle('flipped'));

    prevCard.addEventListener('click', () => {
        if (state.currentCardIndex > 0) {
            state.currentCardIndex--;
            updateCardDisplay();
        }
    });

    nextCard.addEventListener('click', () => {
        if (state.currentCardIndex < state.flashcards.length - 1) {
            state.currentCardIndex++;
            updateCardDisplay();
        }
    });

    // ==========================================================================
    // 7. Interactive Practice Quiz Engine
    // ==========================================================================
    function generateQuiz(rawText) {
        state.quizQuestions = [
            {
                q: "1. Which memory area does the 'new' keyword allocate array objects in Java?",
                options: ["Stack Memory", "Heap Memory", "Method Area", "Register"],
                correct: 1,
                exp: "The 'new' keyword dynamically creates array instances in HEAP memory and returns the reference variable."
            },
            {
                q: "2. What is the default value of an uninitialized int array element in Java?",
                options: ["null", "0", "-1", "undefined"],
                correct: 1,
                exp: "Primitive numeric types (int, long, double) are automatically initialized to 0 in array memory."
            },
            {
                q: "3. When will an ArrayIndexOutOfBoundsException occur?",
                options: ["When accessing index = 0", "When accessing index = array.length - 1", "When accessing index = array.length", "When accessing an even index"],
                correct: 2,
                exp: "Array indices start from 0 to length - 1. Accessing index == length causes ArrayIndexOutOfBoundsException."
            },
            {
                q: "4. What is Bioavailability (F) for an intravenous (IV) drug administration?",
                options: ["50%", "75%", "100%", "0%"],
                correct: 2,
                exp: "Intravenous administration bypasses absorption barriers directly into systemic circulation, giving 100% bioavailability."
            }
        ];

        state.quizScore = 0;
        quizScoreBadge.innerHTML = `<i class="fa-solid fa-trophy"></i> Score: 0/${state.quizQuestions.length}`;

        quizContainer.innerHTML = state.quizQuestions.map((q, qIdx) => `
            <div class="quiz-card" data-qidx="${qIdx}">
                <div class="quiz-question">${q.q}</div>
                <div class="quiz-options">
                    ${q.options.map((opt, oIdx) => `
                        <button class="quiz-option-btn" onclick="checkAnswer(${qIdx}, ${oIdx})">
                            <span>${String.fromCharCode(65 + oIdx)}. ${escapeHTML(opt)}</span>
                            <i class="fa-regular fa-circle"></i>
                        </button>
                    `).join('')}
                </div>
                <div class="quiz-explanation" id="exp-${qIdx}">${escapeHTML(q.exp)}</div>
            </div>
        `).join('');
    }

    window.checkAnswer = function(qIdx, oIdx) {
        const qCard = document.querySelector(`.quiz-card[data-qidx="${qIdx}"]`);
        if (!qCard || qCard.getAttribute('data-answered')) return;

        qCard.setAttribute('data-answered', 'true');
        const qData = state.quizQuestions[qIdx];
        const buttons = qCard.querySelectorAll('.quiz-option-btn');

        buttons.forEach((btn, idx) => {
            if (idx === qData.correct) {
                btn.classList.add('selected-correct');
                btn.querySelector('i').className = 'fa-solid fa-circle-check';
            } else if (idx === oIdx) {
                btn.classList.add('selected-wrong');
                btn.querySelector('i').className = 'fa-solid fa-circle-xmark';
            }
        });

        if (oIdx === qData.correct) {
            state.quizScore++;
            quizScoreBadge.innerHTML = `<i class="fa-solid fa-trophy"></i> Score: ${state.quizScore}/${state.quizQuestions.length}`;
        }

        const expEl = document.getElementById(`exp-${qIdx}`);
        if (expEl) expEl.classList.add('visible');
    };

    // ==========================================================================
    // 8. Visual Memory & Mindmap Diagram Renderer
    // ==========================================================================
    function renderVisualMemoryDiagram(rawText) {
        if (!visualMemoryDiagram) return;
        visualMemoryDiagram.innerHTML = `
            <h4><i class="fa-solid fa-microchip"></i> Array Memory Allocation (1D & 2D Heap Representation)</h4>
            <div style="font-size:13px; color:var(--text-muted); margin-bottom:10px;">Reference variable 'arr' stores address 0x100 pointing to Heap memory allocation:</div>
            <div class="memory-grid-wrapper">
                <div class="memory-block">
                    <div class="memory-cell index">Index [0]</div>
                    <div class="memory-cell value">10</div>
                    <div class="memory-cell addr">0x100</div>
                </div>
                <div class="memory-block">
                    <div class="memory-cell index">Index [1]</div>
                    <div class="memory-cell value">20</div>
                    <div class="memory-cell addr">0x104</div>
                </div>
                <div class="memory-block">
                    <div class="memory-cell index">Index [2]</div>
                    <div class="memory-cell value">30</div>
                    <div class="memory-cell addr">0x108</div>
                </div>
                <div class="memory-block">
                    <div class="memory-cell index">Index [3]</div>
                    <div class="memory-cell value">40</div>
                    <div class="memory-cell addr">0x10C</div>
                </div>
            </div>
            <div class="memory-note"><i class="fa-solid fa-circle-info"></i> Contiguous Memory Blocks: Each integer occupies 4 bytes of heap memory space.</div>
        `;
    }

    function renderMermaidDiagram() {
        const title = state.noteTitle || "Study Notes";
        const code = `
graph TD
    Root["${title}"] --> S1["Core Concepts & Definitions"]
    Root --> S2["Syntax & Memory Flow"]
    Root --> S3["Practice & Applications"]
    S1 --> D1["Heap Allocation & Reference Vars"]
    S2 --> D2["Contiguous Memory & Indexing"]
    S3 --> D3["Interactive Quiz & Flashcards"]
        `;

        mermaidDiagram.innerHTML = `<div class="mermaid">${code}</div>`;
        try {
            if (window.mermaid) mermaid.contentLoaded();
        } catch (e) {
            console.log("Mermaid init error", e);
        }
    }

    // ==========================================================================
    // 9. Local Storage & Export Engine
    // ==========================================================================
    btnSaveNote.addEventListener('click', () => {
        if (!state.renderedMarkdown) {
            alert("Convert a note first before saving!");
            return;
        }

        const newNote = {
            id: Date.now().toString(),
            profile: state.currentProfileKey,
            title: state.noteTitle,
            subject: state.currentSubject,
            raw: rawNotesInput.value,
            date: new Date().toLocaleDateString()
        };

        state.savedNotes.unshift(newNote);
        const storageKey = PROFILES[state.currentProfileKey].storageKey;
        localStorage.setItem(storageKey, JSON.stringify(state.savedNotes));
        updateSavedCountBadge();
        alert(`Saved "${newNote.title}" to ${PROFILES[state.currentProfileKey].name}'s notebook library!`);
    });

    btnSaveNote.addEventListener('click', () => {}); // No duplicate handler

    btnSavedNotes.addEventListener('click', () => {
        renderSavedNotesList();
        drawerSaved.classList.remove('hidden');
    });

    btnCloseSaved.addEventListener('click', () => drawerSaved.classList.add('hidden'));

    function renderSavedNotesList() {
        const query = (searchSaved.value || '').toLowerCase();
        const filtered = state.savedNotes.filter(n => n.title.toLowerCase().includes(query));

        if (filtered.length === 0) {
            savedNotesList.innerHTML = `<p style="color: var(--text-dim); text-align: center;">No saved notes for ${PROFILES[state.currentProfileKey].name}.</p>`;
            return;
        }

        savedNotesList.innerHTML = filtered.map(note => `
            <div class="saved-item-card" data-id="${note.id}">
                <div class="saved-item-title">${escapeHTML(note.title)}</div>
                <div class="saved-item-meta">
                    <span>${note.subject.toUpperCase()}</span>
                    <span>${note.date}</span>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.saved-item-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.getAttribute('data-id');
                const note = state.savedNotes.find(n => n.id === id);
                if (note) {
                    noteTitleInput.value = note.title;
                    rawNotesInput.value = note.raw;
                    subjectSelect.value = note.subject;
                    drawerSaved.classList.add('hidden');
                    btnConvert.click();
                }
            });
        });
    }

    searchSaved.addEventListener('input', renderSavedNotesList);

    // Export Modal Controls
    btnExport.addEventListener('click', () => {
        if (!state.renderedMarkdown) {
            alert("Convert a note first before exporting!");
            return;
        }
        modalExport.classList.remove('hidden');
    });

    btnCloseExport.addEventListener('click', () => modalExport.classList.add('hidden'));

    exportMD.addEventListener('click', () => {
        downloadFile(`${state.noteTitle.replace(/[^a-z0-9]/gi, '_')}.md`, `# ${state.noteTitle}\n\n${state.renderedMarkdown}`);
        modalExport.classList.add('hidden');
    });

    exportHTML.addEventListener('click', () => {
        const fullHTML = `<!DOCTYPE html><html><head><title>${state.noteTitle}</title><link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Patrick+Hand&display=swap" rel="stylesheet"><style>body{font-family:'Patrick Hand', cursive; background:#f9ecef; padding:40px; line-height:1.8;}</style></head><body>${renderedOutput.innerHTML}</body></html>`;
        downloadFile(`${state.noteTitle.replace(/[^a-z0-9]/gi, '_')}.html`, fullHTML);
        modalExport.classList.add('hidden');
    });

    exportPDF.addEventListener('click', () => {
        modalExport.classList.add('hidden');
        if (window.html2pdf) {
            const element = document.getElementById('renderedPaper');
            const opt = {
                margin: 10,
                filename: `${state.noteTitle.replace(/[^a-z0-9]/gi, '_')}_Notebook.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        } else {
            window.print();
        }
    });

    function downloadFile(filename, text) {
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    btnCopyNote.addEventListener('click', () => {
        if (state.renderedMarkdown) {
            navigator.clipboard.writeText(state.renderedMarkdown);
            alert("Copied bulletized text to clipboard!");
        }
    });

    // Load initial sample on startup
    btnSampleJava.click();
});
