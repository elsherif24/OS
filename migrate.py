import os, re, glob

# 1 & 2: Clean data files
for source in ['testbank', 'student']:
    for filepath in glob.glob(f'js/{source}/lec*.js'):
        lec_num = int(re.search(r'lec(\d+)\.js', filepath).group(1))
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Remove id, chapter, source
        content = re.sub(r"^[ \t]*(id|chapter|source):\s*[^,\n]+,?[ \t]*\n", "", content, flags=re.MULTILINE)
        
        # Update push statement if not updated
        if 'const LECTURE =' not in content:
            push_pat = r"window\.ALL_QUESTIONS\.push\(\.\.\.([a-zA-Z0-9_]+)\);"
            repl = f"const LECTURE = {lec_num};\n  const SOURCE = '{source}';\n  window.ALL_QUESTIONS.push(...\\1.map(q => ({{ ...q, lecture: LECTURE, source: SOURCE }})));"
            content = re.sub(push_pat, repl, content)
            
        with open(filepath, 'w') as f:
            f.write(content)

# 5: update storage.js
with open('js/storage.js', 'r') as f:
    store = f.read()
store = store.replace('chapterNum', 'lectureNum')
store = store.replace('ch${String(lectureNum).padStart(2, \'0\')}_', 'lec_${String(lectureNum).padStart(2, \'0\')}_')
store = store.replace('resetChapter', 'resetLecture')
store = store.replace('CountForChapter', 'CountForLecture')
with open('js/storage.js', 'w') as f:
    f.write(store)

# Update app.js
with open('js/app.js', 'r') as f:
    app_js = f.read()
app_js = app_js.replace('Storage.resetChapter(', 'Storage.resetLecture(')
with open('js/app.js', 'w') as f:
    f.write(app_js)

# AI_CONTEXT
with open('AI_CONTEXT.md', 'r') as f:
    ai = f.read()
ai = ai.replace('chapter', 'lecture')
ai = ai.replace('Chapter', 'Lecture')
ai = re.sub(r'ch\{NN\}_\{type\}_\{NNN\}', r'lec_{NN}_{source}_{type}_{hash}', ai)
with open('AI_CONTEXT.md', 'w') as f:
    f.write(ai)

print("Migration complete!")
