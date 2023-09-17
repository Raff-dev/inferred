<p><strong>WOJSKOWA AKADEMIA TECHNICZNA</strong></p>
<p><strong>im. Jarosława Dąbrowskiego</strong></p>
<p><strong>WYDZIAŁ CYBERNETYKI</strong></p>
<p><img src="media/image1.jpeg" style="width:1.91379in;height:2.49645in" alt="A logo of a bird Description automatically generated" /></p>
<p><strong>PRACA DYPLOMOWA</strong></p>
<p>STACJONARNE STUDIA II°</p>
<p>Temat:</p>
<p><strong>Implementacja pulpitu do monitorowania adekwatności modelu symulacyjnego</strong></p>
<p>Autor:</p>
<p><strong>Inż. Rafał Łazicki</strong></p>
<p>Promotor pracy:</p>
<p><strong>dr inż. Marcin Mazurek</strong></p>
<p>Wstęp</p>
<p>- Cel pracy</p>
<p>- Zakres pracy</p>
<p>- Struktura pracy</p>
<p>1. Podstawy teoretyczne</p>
<p>- 1.1 Technologia Digital Twin</p>
<p>- 1.1.1 Definicja i zastosowania</p>
<p>- 1.1.2 Istniejące rozwiązania</p>
<p>- 1.1.3 Monitorowanie modeli</p>
<p>- 1.2 Metody analizy i walidacji modeli symulacyjnych</p>
<p>- 1.2.1 Metody statystyczne</p>
<p>- 1.2.2 Metody maszynowego uczenia</p>
<p>- 1.3 Metody granulacji danych</p>
<p>- 1.4 Architektura systemów wielokomponentowych</p>
<p>2. Architektura</p>
<p>- 2.1 Diagram komponentów</p>
<p>- 2.1 Warstwa serwerowa</p>
<p>- 2.1.1 REST API</p>
<p>- 2.1.2 Integracja modeli symulacyjnych</p>
<p>- 2.1.3 Zastosowanie Celery w zarządzaniu zadaniami</p>
<p>- 2.1.4 Wykorzystanie Django, djangorestframework</p>
<p>- 2.1.5 Poetry jako zarządcze narzędzie wirtualizacji, obsługi zależności oraz budowy paczki</p>
<p>- 2.2 Warstwa interfejsu użytkownika</p>
<p>- 2.2.1 Wykorzystanie ReactJS</p>
<p>- wykorzystanie vite</p>
<p>- 2.2.2 Wykorzystanie Recharts i Material-UI</p>
<p>- 2.3 Konteneryzacja i orkiestracja</p>
<p>- 2.3.1 Zastosowanie Dockera</p>
<p>- uprodukcyjnianie</p>
<p>- skalowalność</p>
<p>- deployment</p>
<p>- 2.3.2 Komunikacja między komponentami</p>
<p>- sieć wewnętrzna dockera</p>
<p>- http, websocket, redis</p>
<p>- 2.4 Wybrane aspekty procesu CI/CD</p>
<p>- 2.4.1 Github pipelines</p>
<p>- 2.4.2 Github workflow</p>
<p>- 2.4.3 Budowa oraz publikacja paczki</p>
<p>3. Implementacja</p>
<p>- 3.1 Moduł symulacyjny (Mock)</p>
<p>- 3.1.1 Generowanie losowych danych</p>
<p>- 3.1.2 Imitacja modeli symulacyjnych</p>
<p>- 3.1.3 Komunikacja z backendem przez Redis</p>
<p>- 3.2 Moduł analizy danych historycznych</p>
<p>- 3.2.1 Przechowywanie i odczyt danych</p>
<p>- 3.2.2 Granulacja danych</p>
<p>- 3.2.3 Prezentacja historycznych predykcji</p>
<p>- 3.3 Moduł prognozowania w czasie rzeczywistym</p>
<p>- 3.3.1 Odbiór danych</p>
<p>- 3.3.2 Generowanie predykcji</p>
<p>- 3.4 Moduł porównawczy metryk modeli</p>
<p>- 3.4.1 Prezentacja metryk</p>
<p>- 3.4.2 Wykrywanie i prezentacja błędów</p>
<p>- 3.5 Rejestracja modeli oraz sensorów</p>
<p>- 3.5.1 Wykorzystanie Django Admin Panel</p>
<p>- 3.5.2 Wykorzystanie REST API</p>
<p>- 3.6 Moduł monitorowania w czasie rzeczywistym</p>
<p>- 3.6.1 Odbiór i przetwarzanie danych</p>
<p>- 3.6.2 Komunikacja WebSocket</p>
<p>4. Testy</p>
<p>- 4.1 Środowisko testowe</p>
<p>- 4.1.1 Selekcja i charakteryzacja narzędzi testujących</p>
<p>- 4.1.2 Konfiguracja i parametryzacja środowiska testowego</p>
<p>- 4.1.3 Procedury inicjalizacyjne i przygotowawcze</p>
<p>- 4.1.4 Metodologie testowania</p>
<p>- 4.2 Ewaluacja funkcjonalności i zgodności</p>
<p>- 4.4 Analiza i optymalizacja zużycia zasobów</p>
<p>- 4.5 Identyfikacja i rekomendacje wobec wykrytych nieprawidłowości</p>
<p>- 4.6 Analiza kodu przy wykorzystaniu testów statycznych</p>
<p>5. Dyskusja</p>
<p>- 4.4 Analiza wyników</p>
<p>- 4.5 Ograniczenia i Wyzwania</p>
<p>- 4.6 Możliwości dalszego rozwoju</p>
<p>- caching z wykorzystaniem redis</p>
<p>- wykorzystanie analitycznej bazy danych (cassandra/clickhouse)</p>
<p>- zbudowanie dedykowanego narzędzia wizualizacji danych</p>
<p>6. Podsumowanie</p>
<p>7. Bibliografia</p>
