# Fahrradverleih Backend

Das Backend der Fahrradverleih-Fallstudie ist in Node.js mit express implementiert und
orientiert sich and dem REST-Pattern.

Die Implementierung verzichtet im Rahmen der Arbeit unter anderem auf Persistierung,
bei einem Neustart ist entsprechend zu erwarten, dass alle Daten zurückgesetzt werden.

## Ausführen

Nach dem Klonen und abrufen der Abhängigkeiten (`npm install`) kann das Projekt z.B. mit
dem `start` Script gebaut, ausgeführt und bei Änderungen automatisch neu bereitgestellt
werden.

## Umgebungsvariablen

Einige Parameter für die Laufzeit können in einer `.env` Datei angepasst werden. Zur
Orientierung befindet sich im Root-Verzeichnis eine Datei `.env.example`, welche die
konfigurierbaren Variablen enthält.

Insbesondere der Port und CORS-Richtlinien sollten vor der Bereitstellung geprüft und
ggf. angepasst werden.

## Weitere Hinweise

- Damit ausgestellte Tokens auch über einen Neustart hinweg ihre Gültigkeit bewahren,
  wird hier auf eine einfache Implementierung von JSON Web-Tokens (JWT) gesetzt.
- Es sind einige statische Beispieldaten vorkonfiguriert. Da die Registrierung neuer
  Accounts nicht vorgesehen ist, müssen hier also die vordefinierten Login-Daten
  verwendet werden. Diese können einfach der Datei `data-store.ts` entnommen werden.
