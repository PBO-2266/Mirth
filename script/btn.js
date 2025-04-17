// "Toggle All"-Button hinzufügen
const toggleAllBtn = document.createElement('button');
toggleAllBtn.textContent = 'Show All SubTables';
toggleAllBtn.className = 'toggle-all-btn';
document.querySelector('#channelsTable').insertAdjacentElement('beforebegin', toggleAllBtn);

let allVisible = false; // Status für alle Tabellen

toggleAllBtn.addEventListener('click', () => {
                const allContainers = document.querySelectorAll('.container'); // Alle Container auswählen
                const allTables = document.querySelectorAll('.table'); // Alle Tabellen auswählen
                const allDestButtons = document.querySelectorAll('.dest-btn');
                const allSourceFilterButtons = document.querySelectorAll('.source-filter-btn');
                const allSourceTransformerButtons = document.querySelectorAll('.source-transformer-btn');
                const allRows = document.querySelectorAll('.hidden-row');

                allRows.forEach(row => {
                               if (!allVisible) {
                                               row.style.display = "table-row"; // Zeile anzeigen
                               } else {
                                               row.style.display = "none"; // Zeile ausblenden
                               }
    });
                
                allContainers.forEach(container => {
                               if (!allVisible) {
                                               container.classList.remove('hidden');// Alle Container anzeigen (Überschrift + Tabelle)
                               } else {
                                               container.classList.add('hidden'); // Alle Container ausblenden
                               }
                });
                
                allTables.forEach(table => {
                               if (!allVisible) {
                                               table.classList.remove('hidden');// Alle Tabellen anzeigen (Überschrift + Tabelle)
                               } else {
                                               table.classList.add('hidden'); // Alle Tabellen ausblenden
                               }
                });

                // Update der individuellen Button-Texte
                allDestButtons.forEach(button => {
                               button.textContent = allVisible ? 'Show Destinations' : 'Hide Destinations';
                });
                allSourceFilterButtons.forEach(button => {
                               button.textContent = allVisible ? 'Show Filters' : 'Hide Filters';
                });
                allSourceTransformerButtons.forEach(button => {
                               button.textContent = allVisible ? 'Show Transformers' : 'Hide Transformers';
                });

                allVisible = !allVisible; // Status umkehren
                toggleAllBtn.textContent = allVisible ? 'Hide All SubTables' : 'Show All SubTables';
});
