document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    //                    ŰRLAP KEZELÉSE
    // =========================================================
    const submitBtn = document.getElementById('submitQuoteBtn');
    
    // CSAK AKKOR futtatjuk az űrlap kódját, ha az űrlap gombja létezik az adott oldalon
    if (submitBtn) {
        const form = document.getElementById('quoteForm');
        const formMessage = document.getElementById('formMessage');
        const nameInput = document.getElementById('quoteName');
        const phoneInput = document.getElementById('quotePhone');
        const cityInput = document.getElementById('quoteCity');
        const descriptionInput = document.getElementById('quoteDescription');

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Üzenetdoboz és mező keretek alaphelyzetbe állítása
            resetValidationUI();

            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            const city = cityInput.value.trim();
            const description = descriptionInput.value.trim();

            // Validáció: Név és Telefonszám kötelező
            if (!name || !phone) {
                showError("Kérjük, adja meg a nevét és a telefonszámát a kapcsolatfelvételhez!");
                
                // Piros keret a hiányzó mezőknek
                if (!name) nameInput.classList.add('border-red-500', 'bg-red-50');
                if (!phone) phoneInput.classList.add('border-red-500', 'bg-red-50');
                return; 
            }

            // Ha minden rendben, JSON összeállítása
            const quoteData = {
                nev: name,
                telefon: phone,
                telepules: city,
                leiras: description,
                bekuldesIdeje: new Date().toISOString(),
                statusz: 'Új'
            };

            console.log("Adatbázisba küldésre előkészítve:", quoteData);

            // Sikeres beküldés visszajelzése a felületen
            showSuccess("Köszönjük megkeresését! Szakemberünk hamarosan hívni fogja a megadott számon.");
            
            // Űrlap ürítése
            form.reset();
        });

        // Segédfüggvények a UI kezeléshez (csak az űrlaphoz kellenek)
        function resetValidationUI() {
            formMessage.classList.add('hidden');
            formMessage.className = 'hidden mb-6 p-4 rounded-md font-bold text-sm transition-all duration-300';
            
            const inputs = [nameInput, phoneInput, cityInput, descriptionInput];
            inputs.forEach(input => {
                input.classList.remove('border-red-500', 'bg-red-50');
            });
        }

        function showError(message) {
            formMessage.textContent = message;
            formMessage.classList.remove('hidden');
            formMessage.classList.add('bg-red-100', 'text-red-700', 'border-l-4', 'border-red-500');
        }

        function showSuccess(message) {
            formMessage.textContent = message;
            formMessage.classList.remove('hidden');
            formMessage.classList.add('bg-green-100', 'text-green-800', 'border-l-4', 'border-green-500');
        }
    } // <-- Itt zárul le az if (submitBtn) feltétel!


    // =========================================================
    //                HAMBURGER MENÜ KEZELÉSE
    // =========================================================
    // Ez a rész mindig lefut, függetlenül attól, hogy van-e űrlap az oldalon
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    
    // Ellenőrizzük, hogy a navbar betöltött-e
    if (hamburgerBtn) {
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        let isMenuOpen = false;

        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            
            const line1 = hamburgerBtn.querySelector('.line-1');
            const line2 = hamburgerBtn.querySelector('.line-2');
            const line3 = hamburgerBtn.querySelector('.line-3');

            if (isMenuOpen) {
                line1.classList.add('translate-y-2', 'rotate-45');
                line2.classList.add('opacity-0');
                line3.classList.add('-translate-y-2', '-rotate-45');
                
                // Menü lecsúsztatása és klikkelhetőség engedélyezése
                mobileMenu.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
                mobileMenu.classList.add('translate-y-0', 'opacity-100');
                
                // Háttér görgetésének letiltása
                document.body.classList.add('overflow-hidden');
            } else {
                line1.classList.remove('translate-y-2', 'rotate-45');
                line2.classList.remove('opacity-0');
                line3.classList.remove('-translate-y-2', '-rotate-45');
                
                // Menü felcsúsztatása és klikkelhetőség letiltása
                mobileMenu.classList.remove('translate-y-0', 'opacity-100');
                mobileMenu.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
                
                // Háttér görgetésének engedélyezése
                document.body.classList.remove('overflow-hidden');
            }
        }

        hamburgerBtn.addEventListener('click', toggleMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (isMenuOpen) toggleMenu();
            });
        });
    }

    
    // =========================================================
    //                TERMÉK KATEGÓRIA SZŰRŐ
    // =========================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    // Csak akkor fut le, ha a termékek oldalon vagyunk (vannak gombok és kártyák)
    if (filterBtns.length > 0 && productCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                
                // 1. Lépés: Levegyük az "aktív" stílust minden gombról
                filterBtns.forEach(b => {
                    b.classList.remove('bg-remsei-dark', 'text-white');
                    b.classList.add('bg-white', 'text-remsei-dark', 'border', 'border-gray-200');
                });

                // 2. Lépés: Rátesszük az "aktív" stílust arra, amire most kattintottak
                btn.classList.remove('bg-white', 'text-remsei-dark', 'border', 'border-gray-200');
                btn.classList.add('bg-remsei-dark', 'text-white');

                // 3. Lépés: Kiolvassuk, mire akar szűrni (pl. "futes", "hutes", "all")
                const filterValue = btn.getAttribute('data-filter');

                // 4. Lépés: Végigmegyünk a kártyákon és elrejtjük/megjelenítjük őket
                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || filterValue === cardCategory) {
                        card.style.display = 'flex'; // Mivel a kártya eredetileg 'flex flex-col'
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
});