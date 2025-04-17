document.addEventListener('DOMContentLoaded', () => {

 

                const channelsTableBody = document.querySelector('#channelsTable tbody');

                let channels = jsonData.list.channel;

                

                // Port zu jedem Channel hinzufügen (oder "NA", wenn kein TCP Listener)

                channels = channels.map(channel => {

                               const portInfo = channel.sourceConnector.transportName === "TCP Listener" 

                                               ? channel.sourceConnector.properties.listenerConnectorProperties.port 

                                               : "NA";

                               return { ...channel, portInfo }; // Neues Feld hinzufügen

                });

 

                // Nach Portnummer sortieren (NA am Ende)

                channels.sort((a, b) => {

                               if (a.portInfo === "NA") return 1; // "NA" nach unten sortieren

                               if (b.portInfo === "NA") return -1;

                               return a.portInfo - b.portInfo; // Sortierung nach numerischer Port-Nummer

                });

                

 

                               

                channels.forEach((channel, index) => {

                               const row = document.createElement('tr');

 

                               // SourceProperties nur bei TCP Listener

                               let host = 'N/A';

                               let charsetEncoding = 'N/A';

                               if (channel.sourceConnector.transportName === "TCP Listener") {

                                               host = channel.sourceConnector.properties.listenerConnectorProperties.host;

                                               charsetEncoding = channel.sourceConnector.properties.charsetEncoding;

                               }

 

                               // Hauptzeile erstellen

                               row.innerHTML = `

                                               <td><b>${channel.name}</b></td>

                                               <td>${channel.id}</td>

                                               <td>${channel.exportData.metadata.enabled ? 'Enabled' : 'Disabled'}</td>

                                               <td><button class="source-filter-btn" data-index="${index}">Show Filters</button>

                                               <button class="source-transformer-btn" data-index="${index}">Show Transformers</button></td>

                                               <td>${channel.sourceConnector.transportName}</td>

                                               <td>${host}</td>

                                               <td>${channel.portInfo}</td>

                                               <td>${charsetEncoding}</td>

                                               <td><button class="dest-btn" data-index="${index}">Show Destinations</button></td>

                               `;

 

                               channelsTableBody.appendChild(row);

                               

                               // Tabelle für Filter-Schritte erstellen

                               let filterTable = '<table class="connector-table" id="filters-' + index + '">';

                               filterTable += `

                                               <tr>

                                                               <th>Sequence</th>

                                                               <th>Name</th>

                                                               <th>Type</th>

                                                               <th>Details</th>

                                                               <th>Enabled</th>

                                               </tr>

                               `;

 

                               // Prüfen, ob Filter-Elemente existieren

                               if (channel.sourceConnector.filter) {

                                               const elements = channel.sourceConnector.filter.elements;

                                               if (elements) {

                                                               Object.keys(elements).forEach(key => {

                                                                               const step = elements[key];

                                                                               let details = '';

                                                                               if (step.sequenceNumber > 0){

                                                                                              if (key === "com.mirth.connect.plugins.rulebuilder.RuleBuilderRule") {

                                                                                                              details += `<b>Operator:</b> ${step.operator}<br>`;

                                                                                              }

                                                                                              else if (key === "com.mirth.connect.plugins.javascriptrule.JavaScriptRule") {

                                                                                                              details += `<b>Operator:</b> ${step.operator}<br>`;

                                                                                              }                                                                                                             

                                                                               }

                                                                                              

                                                                               

 

                                                                               if (key === "com.mirth.connect.plugins.rulebuilder.RuleBuilderRule") {

                                                                                              details += `<b>Variable:</b> ${step.variable}<br>`;

                                                                                              details += `<b>Mapping:</b> ${step.mapping}<br>`;

                                                                                              details += `<b>Default Value:</b> ${step.defaultValue}<br>`;

                                                                                              if (step.replacements && step.replacements['org.apache.commons.lang3.tuple.ImmutablePair']) {

                                                                                                              details += `<b>Replacements:</b><br><ul>`;

                                                                                                              step.replacements['org.apache.commons.lang3.tuple.ImmutablePair'].forEach(pair => {

                                                                                                                              details += `<li>${pair.left.$} → ${pair.right.$}</li>`;

                                                                                                              });

                                                                                                              details += `</ul>`;

                                                                                              }

                                                                                              details += `<b>Scope:</b> ${step.scope}<br>`;

                                                                               } else if (key === "com.mirth.connect.plugins.javascriptrule.JavaScriptRule") {

                                                                                              const formattedScript = step.script.replace(/\n/g, '<br>');

                                                                                              details += `<b>Script:</b><br>${formattedScript}<br>`;

                                                                                              //details += `<b>Script:</b> ${step.script}<br>`;

                                                                               } else {

                                                                                              details = 'N/A'; // Für unbekannte Step-Typen

                                                                               }

 

                                                                               filterTable += `

                                                                                              <tr>

                                                                                                              <td>${step.sequenceNumber}</td>

                                                                                                              <td>${step.name}</td>

                                                                                                              <td>${key.split('.').pop()}</td>

                                                                                                              <td>${details}</td>

                                                                                                              <td>${step.enabled ? 'Yes' : 'No'}</td>

                                                                                              </tr>

                                                                               `;

                                                               });

                                               } else {

                                                               // Nachricht hinzufügen, wenn Filter.elements null ist

                                                               filterTable += `

                                                                               <tr>

                                                                                              <td colspan="5">No Filter Elements Available</td>

                                                                               </tr>

                                                               `;

                                               }

                               } else {

                                               // Nachricht hinzufügen, wenn kein Filter vorhanden ist

                                               filterTable += `

                                                               <tr>

                                                                               <td colspan="5">No Filters Available</td>

                                                               </tr>

                                               `;

                               }

 

                               filterTable += '</table>';

                               

                               // Debugging: Ausgabe der Tabelle

                               //console.log(`Filter Table for index ${index}:`, filterTable);

 

                               const containerSourceFilter = document.createElement('tr');

                               containerSourceFilter.id = `source-filter-row-${index}`;

                               containerSourceFilter.classList.add('source-filter-row', 'hidden-row'); 

                               //containerSourceFilter.style.display = "none"

                               containerSourceFilter.innerHTML = `

                                               <td colspan="8">

                                                               <div class="container hidden" id="sourceFilter-container-${index}">

                                                               <h3>SourceFilter for Channel: ${channel.name}</h3>

                                                               ${filterTable}

                                                               </div>

                                               </td>

                               `;

                               channelsTableBody.appendChild(containerSourceFilter);

                               

                               // Tabelle für Transformer-Schritte erstellen

                               let transformerTable = '<table class="connector-table" id="transformers-' + index + '">';

                               transformerTable += `

                                               <tr>

                                                               <th>Sequence</th>

                                                               <th>Name</th>

                                                               <th>Type</th>

                                                               <th>Details</th>

                                                               <th>Enabled</th>

                                               </tr>

                               `;

 

                               // Prüfen, ob Transformer-Elemente existieren

                               if (channel.sourceConnector.transformer) {

                                               const elements = channel.sourceConnector.transformer.elements;

                                               if (elements) {

                                                               Object.keys(elements).forEach(key => {

                                                                               const step = elements[key];

                                                                               let details = '';

 

                                                                               if (key === "com.mirth.connect.plugins.mapper.MapperStep") {

                                                                                              details += `<b>Variable:</b> ${step.variable}<br>`;

                                                                                              details += `<b>Mapping:</b> ${step.mapping}<br>`;

                                                                                              details += `<b>Default Value:</b> ${step.defaultValue}<br>`;

                                                                                              if (step.replacements && step.replacements['org.apache.commons.lang3.tuple.ImmutablePair']) {

                                                                                                              details += `<b>Replacements:</b><br><ul>`;

                                                                                                              step.replacements['org.apache.commons.lang3.tuple.ImmutablePair'].forEach(pair => {

                                                                                                                              details += `<li>${pair.left.$} → ${pair.right.$}</li>`;

                                                                                                              });

                                                                                                              details += `</ul>`;

                                                                                              }

                                                                                              details += `<b>Scope:</b> ${step.scope}<br>`;

                                                                               } else if (key === "com.mirth.connect.plugins.javascriptstep.JavaScriptStep") {

                                                                                              const formattedScript = step.script.replace(/\n/g, '<br>');

                                                                                              details += `<b>Script:</b><br>${formattedScript}<br>`;

                                                                                              //details += `<b>Script:</b> ${step.script}<br>`;

                                                                               } else {

                                                                                              details = 'N/A'; // Für unbekannte Step-Typen

                                                                               }

 

                                                                               transformerTable += `

                                                                                              <tr>

                                                                                                              <td>${step.sequenceNumber}</td>

                                                                                                              <td>${step.name}</td>

                                                                                                              <td>${key.split('.').pop()}</td>

                                                                                                              <td>${details}</td>

                                                                                                              <td>${step.enabled ? 'Yes' : 'No'}</td>

                                                                                              </tr>

                                                                               `;

                                                               });

                                               } else {

                                                               // Nachricht hinzufügen, wenn Transformer.elements null ist

                                                               transformerTable += `

                                                                               <tr>

                                                                                              <td colspan="5">No Transformer Elements Available</td>

                                                                               </tr>

                                                               `;

                                               }

                               } else {

                                               // Nachricht hinzufügen, wenn kein Transformer vorhanden ist

                                               transformerTable += `

                                                               <tr>

                                                                               <td colspan="5">No Transformers Available</td>

                                                               </tr>

                                               `;

                               }

 

                               transformerTable += '</table>';

                               

                               // Debugging: Ausgabe der Tabelle

                               //console.log(`Transformer Table for index ${index}:`, transformerTable);

 

                               const containerSourceTransformer = document.createElement('tr');

                               containerSourceTransformer.id = `source-transformer-row-${index}`;

                               containerSourceTransformer.classList.add('source-transformer-row', 'hidden-row'); 

                               //containerSourceTransformer.style.display = "none"

                               containerSourceTransformer.innerHTML = `

                                               <td colspan="8">

                                                               <div class="container hidden" id="sourceTransformer-container-${index}">

                                                               <h3>SourceTransformer for Channel: ${channel.name}</h3>

                                                               ${transformerTable}

                                                               </div>

                                               </td>

                               `;

                               channelsTableBody.appendChild(containerSourceTransformer);

 

                               // Tabelle für Destinations erstellen

                               let destinationTable = '<table class="connector-table" id="destinations-' + index + '">';

                               destinationTable += `

                                               <tr>

                                                               <th>Name</th>

                                                               <th>Type</th>

                                                               <th>ID</th>

                                                               <th>Status</th>

                                                               <th>Remote Address</th>

                                                               <th>Remote Port</th>

                                                               <th>Actions</th>

                                               </tr>

                               `;

                               

 

                               // Destinations prüfen und verarbeiten

                               const connectors = Array.isArray(channel.destinationConnectors.connector)

                                               ? channel.destinationConnectors.connector

                                               : [channel.destinationConnectors.connector];

                                               

                               connectors.sort((a, b) => a.metaDataId - b.metaDataId).forEach((connector, connectorIndex) => {

                               

                               const filterRows = connector.filter && connector.filter.elements

                               ? Object.keys(connector.filter.elements).map((key) => {

                                               const elementType = key.split('.').pop(); // Typ extrahieren

                                               const elements = Array.isArray(connector.filter.elements[key])

                                                               ? connector.filter.elements[key] // Mehrere Kinder

                                                               : [connector.filter.elements[key]]; // Einzelnes Element

 

                                               return elements.map((element) => {

                                                               let details = 'N/A';

 

                                                               // Typen-spezifische Verarbeitung

                                                               if (elementType === 'RuleBuilderRule') {

                                                                               const values = Array.isArray(element.values?.string) ? element.values.string.join(', ') : 'N/A';

                                                                               details = `<b>Field:</b> ${element.field || 'N/A'}<br>

                                                                                                                 <b>Condition:</b> ${element.condition || 'N/A'}<br>

                                                                                                                 <b>Values:</b> ${values}<br>

                                                                                                                 ${element.operator ? `<br><b>Operator:</b> ${element.operator}` : ''}`;

                                                               } else if (elementType === 'JavaScriptRule') {

                                                                               const formattedScript = element.script ? element.script.replace(/\n/g, '<br>') : 'N/A'; // Zeilenumbruch formatieren

                                                                               details = `<b>Script:</b><br>${formattedScript}

                                                                                                                              ${element.operator ? `<br><br><b>Operator:</b> ${element.operator}` : ''}`;

                                                               } else {

                                                                               // Fallback für unbekannte Typen

                                                                               details = `<b>Type:</b> ${elementType}<br>

                                                                                                                 <b>Name:</b> ${element.name || 'N/A'} 

                                                                                                                              ${element.operator ? `<br><br><b>Operator:</b> ${element.operator}` : ''}`;

                                                               }

 

                                                               return `

                                                                               <tr>

                                                                                              <td>${element.sequenceNumber}</td>

                                                                                              <td>${element.name || 'N/A'}</td>

                                                                                              <td>${elementType}</td>

                                                                                              <td>${details}</td>

                                                                                              <td>${element.enabled ? 'Enabled' : 'Disabled'}</td>

                                                                               </tr>

                                                               `;

                                               }).join('');

                               }).join('')

                               : `

                                               <tr>

                                                               <td colspan="5">No Filter Data Available</td>

                                               </tr>

                               `;

 

 

 

                               // Prüfen, ob es Transformer gibt und die Elemente vorhanden sind

                               const transformerRows = connector.transformer && connector.transformer.elements

                               ? Object.keys(connector.transformer.elements).map((key) => {

                                               const elementType = key.split('.').pop(); // Typ extrahieren

                                               const elements = Array.isArray(connector.transformer.elements[key])

                                                               ? connector.transformer.elements[key] // Mehrere Kinder

                                                               : [connector.transformer.elements[key]]; // Einzelnes Element

 

                                               return elements.map((element) => {

                                                               let details = 'N/A';

 

                                                               if (elementType === 'JavaScriptStep') {

                                                                               const formattedScript = element.script ? element.script.replace(/\n/g, '<br>') : 'N/A'; // Zeilenumbruch formatieren

                                                                               details = `<b>Script:</b><br>${formattedScript}`;

                                                               } else {

                                                                               // Fallback für unbekannte Typen

                                                                               details = `<b>Type:</b> ${elementType}<br>

                                                                                                                 <b>Name:</b> ${element.name || 'N/A'}`;

                                                               }

 

                                                               return `

                                                                               <tr>

                                                                                              <td>${element.sequenceNumber}</td>

                                                                                              <td>${element.name || 'N/A'}</td>

                                                                                              <td>${elementType}</td>

                                                                                              <td>${details}</td>

                                                                                              <td>${element.enabled ? 'Enabled' : 'Disabled'}</td>

                                                                               </tr>

                                                               `;

                                               }).join('');

                               }).join('')

                               : `

                                               <tr>

                                                               <td colspan="5">No Transformer Data Available</td>

                                               </tr>

                               `;

 

 

                               // Untertabellen in die Destination-Zeilen integrieren

                               destinationTable += `

                                               <tr id="dest-row-${index}-${connectorIndex}">

                                                               <td><b>${connector.name || 'N/A'}</b></td>

                                                               <td>${connector.transportName || 'N/A'}</td>

                                                               <td>${connector.metaDataId || 'N/A'}</td>

                                                               <td>${connector.enabled ? 'Enabled' : 'Disabled'}</td>

                                                               <td>${connector.properties.remoteAddress || 'N/A'}</td>

                                                               <td>${connector.properties.remotePort || 'N/A'}</td>

                                                               <td>

                                                                               <button class="toggle-filter-btn" data-index="${index}" data-connector="${connectorIndex}">Toggle Filter</button>

                                                                               <button class="toggle-transformer-btn" data-index="${index}" data-connector="${connectorIndex}">Toggle Transformer</button>

                                                               </td>

                                               </tr>

                                               <tr id="dest-filter-row-${index}-${connectorIndex}" class="hidden-row">

                                                               <td colspan="7">

                                                                               <h4>Filter for Destination: ${connector.name}</h4>

                                                                               <table class="sub-table">

                                                                                              <tr>

                                                                                                              <th>Sequence</th>

                                                                                                              <th>Name</th>

                                                                                                              <th>Type</th>

                                                                                                              <th>Details</th>

                                                                                                              <th>Status</th>

                                                                                              </tr>

                                                                                              ${filterRows}

                                                                               </table>

                                                               </td>

                                               </tr>

                                               <tr id="dest-transformer-row-${index}-${connectorIndex}" class="hidden-row">

                                                               <td colspan="7">

                                                                               <h4>Transformer for Destination: ${connector.name}</h4>

                                                                               <table class="sub-table">

                                                                                              <tr>

                                                                                                              <th>Sequence</th>

                                                                                                              <th>Name</th>

                                                                                                              <th>Type</th>

                                                                                                              <th>Details</th>

                                                                                                              <th>Status</th>

                                                                                              </tr>

                                                                                              ${transformerRows}

                                                                              </table>

                                                               </td>

                                               </tr>

                               `;

 

                               });

 

                               destinationTable += '</table>';

 

                               // Hinzufügen der Destination-Tabelle unter der Haupttabelle

                               const destRow = document.createElement('tr');

                               destRow.id = `dest-row-${index}`;

                               destRow.classList.add('dest-row', 'hidden-row'); 

                               //destRow.style.display = "none"

                               destRow.innerHTML = `                                                

                                               <td colspan="8">

                                               <div class="container hidden" id="destinations-container-${index}">

                                               <h3>Destinations for Channel: ${channel.name}</h3>

                                               ${destinationTable}</div></td>

                               `;

                               channelsTableBody.appendChild(destRow);       

                });

                

                // Event-Listener für Transformer-Buttons

                document.querySelectorAll('.source-transformer-btn').forEach(button => {

                               button.addEventListener('click', (event) => {

                                               const index = event.target.getAttribute('data-index');

                                               const container = document.getElementById(`sourceTransformer-container-${index}`);

                                               const table = document.getElementById(`transformers-${index}`);

                                               const row = document.getElementById(`source-transformer-row-${index}`);

                                               if (container) { // Existenz der Tabelle prüfen

                                                               /*if (container.classList.contains('hidden')) {

                                                                               container.classList.remove('hidden');

                                                                               event.target.textContent = 'Hide Transformers';

                                                               } else {

                                                                               container.classList.add('hidden');

                                                                               event.target.textContent = 'Show Transformers';

                                                               }*/

                                                               if (row.style.display === "none") {

                row.style.display = "table-row"; // Zeile wieder anzeigen

                                                               container.classList.remove('hidden');

                                                               event.target.textContent = 'Hide Transformers';

            } else {

                row.style.display = "none"; // Zeile komplett ausblenden

                                                               container.classList.add('hidden');

                                                               event.target.textContent = 'Show Transformers';

            }

                                               } else {

                                                               console.error(`Transformer table with ID transformers-${index} not found.`);

                                               }

                               });

                });

                

                // Event-Listener für Filter-Buttons

                document.querySelectorAll('.source-filter-btn').forEach(button => {

                               button.addEventListener('click', (event) => {

                                               const index = event.target.getAttribute('data-index');

                                               const container = document.getElementById(`sourceFilter-container-${index}`);

                                               const table = document.getElementById(`filters-${index}`);

                                               const row = document.getElementById(`source-filter-row-${index}`);

                                               if (container) { 

                                                               if (row.style.display === "none") {

                row.style.display = "table-row"; // Zeile wieder anzeigen

                                                               container.classList.remove('hidden');

                                                               event.target.textContent = 'Hide Filters';

            } else {

                row.style.display = "none"; // Zeile komplett ausblenden

                                                               container.classList.add('hidden');

                                                               event.target.textContent = 'Show Filters';

            }

                                               } else {

                                                               console.error(`Filter table with ID filters-${index} not found.`);

                                               }

                               });

                });

 

                // Event-Listener für Buttons

                document.querySelectorAll('.dest-btn').forEach(button => {

                               button.addEventListener('click', (event) => {

                                               const index = event.target.getAttribute('data-index');

                                               const table = document.getElementById(`destinations-${index}`);

                                               const container = document.getElementById(`destinations-container-${index}`);

                                               const row = document.getElementById(`dest-row-${index}`);                                    

                                               /*if (container.classList.contains('hidden')) {

                                                               container.classList.remove('hidden');

                                                               event.target.textContent = 'Hide Destinations';

                                               } else {

                                                               container.classList.add('hidden');

                                                               event.target.textContent = 'Show Destinations';

                                               }*/

            if (row.style.display === "none") {

                row.style.display = "table-row"; // Zeile wieder anzeigen

                                                               container.classList.remove('hidden');

                                                               event.target.textContent = 'Hide Destinations';

            } else {

                row.style.display = "none"; // Zeile komplett ausblenden

                                                               container.classList.add('hidden');

                                                               event.target.textContent = 'Show Destinations';

            }

                               });

                });

                

                document.querySelectorAll('.toggle-filter-btn').forEach(button => {

                               button.addEventListener('click', (event) => {

                                               const index = event.target.getAttribute('data-index');

                                               const connectorIndex = event.target.getAttribute('data-connector');

                                               const filterRow = document.getElementById(`dest-filter-row-${index}-${connectorIndex}`);

                                               if (filterRow) {

                                                               filterRow.style.display = filterRow.style.display === 'none' ? 'table-row' : 'none';

                                               }

                               });

                });

 

                document.querySelectorAll('.toggle-transformer-btn').forEach(button => {

                               button.addEventListener('click', (event) => {

                                               const index = event.target.getAttribute('data-index');

                                               const connectorIndex = event.target.getAttribute('data-connector');

                                               const transformerRow = document.getElementById(`dest-transformer-row-${index}-${connectorIndex}`);

                                               if (transformerRow) {

                                                               transformerRow.style.display = transformerRow.style.display === 'none' ? 'table-row' : 'none';

                                               }

                               });

                });

});
