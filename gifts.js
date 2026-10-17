/* The gallery is static; only aggregate contributions come from the shared API. */
window.WeddingGifts = (() => {
  const photos = {
    hotel: 'https://images.unsplash.com/photo-1722229808540-054073c5665b?auto=format&fit=crop&w=1100&q=85',
    rail: 'https://images.unsplash.com/photo-1618153231956-df23dcb21c07?auto=format&fit=crop&w=1100&q=85',
    flights: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1100&q=85',
    restaurants: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1100&q=85',
    onsen: 'https://images.unsplash.com/photo-1644413638617-02369c89c156?auto=format&fit=crop&w=1100&q=85',
    pokemon: 'https://images.unsplash.com/photo-1609372332255-611485350f25?auto=format&fit=crop&w=1100&q=85',
    together: 'https://pub-2e3024c43ee34ef781ed4df20ecad1c8.r2.dev/japan.jpg'
  };
  const gifts = [
    { id: 'flights', target: 120000, image: photos.flights },
    { id: 'hotel', target: 200000, image: photos.hotel },
    { id: 'rail', target: 80000, image: photos.rail },
    { id: 'restaurants', target: 20000, image: photos.restaurants },
    { id: 'onsen', target: 10000, image: photos.onsen },
    { id: 'pokemon', target: null, image: photos.pokemon },
    { id: 'together', target: null, image: photos.together }
  ];
  const copy = {
    en: {
      eyebrow: 'A little piece of our adventure', title: 'Our honeymoon dream',
      intro: "For anyone who would like to contribute, we're saving for our honeymoon in Japan. We hope to discover its beautiful landscapes, food and culture together.",
      invitation: 'These are a few moments we’re dreaming of. If you wish, you can help make one of them happen — in full or with a little contribution.',
      optional: 'Your presence is already the most beautiful gift.',
      browse: 'Little moments, lasting memories', browseSub: 'Choose a moment to discover more.',
      titles: ['A place to slow down', 'Across Japan by train', 'The start of our adventure', 'A taste of Japan', 'A moment of calm', 'Just one more Pokémon…', 'A little something for our journey'],
      tags: ['Hotel', 'JR Pass', 'Flights', 'Restaurants', 'Onsen', 'Pokémon', 'A gift of your choice'],
      descriptions: ['Somewhere to wake up slowly, discover a new neighbourhood and feel at home, far from home.', 'From city lights to mountain views, a window seat for all the beautiful places in between.', 'Two seats, a long flight, and the excitement of discovering somewhere new together.', 'A tiny ramen shop, a sushi counter, a meal we’ll still be talking about years later.', 'Warm water, quiet surroundings, and a little pause to take it all in.', 'A few very essential souvenirs. We can’t promise we’ll know when to stop.', 'For an unexpected discovery, a small detour, or whatever makes the journey a little more special.'],
      any: 'Any amount', infinite: '∞ · no limit', covered: 'Fully gifted', coveredThanks: 'Made possible with love',
      raised: 'contributed', remaining: 'still to dream', open: 'Discover this moment',
      methods: 'Help this memory happen', methodsBody: 'If you’d like to take part, use whichever option suits you. A little contribution means just as much.',
      reference: 'If possible, include the item name in your transfer reference.',
      record: 'Already contributed? Add a message', recordIntro: 'After making your transfer, tell us about your gift and leave a little note.',
      part: 'A little contribution', full: 'Cover the remaining amount', amount: 'Your contribution (€)',
      amountHint: 'For PayNow, enter the approximate equivalent in euros so the progress stays consistent.',
      name: 'Your name', nameHint: 'Optional', message: 'A little note for us',
      private: 'Your name and message stay private, just for us. Only the contribution total is shared.',
      confirm: 'I have already made this transfer.', save: 'Send our gift & message', saving: 'Saving…',
      success: 'Thank you for being part of our adventure. Your gift and message have been recorded with love.',
      selfReported: 'Progress reflects gifts reported by our guests.',
      loading: 'Gathering the little pieces of our journey…', unavailable: 'Contribution progress is temporarily unavailable. Please check back before making a gift.',
      retry: 'Try again', error: 'We couldn’t save your message. Please try again — your transfer has not been repeated.',
      conflict: 'Someone else has just contributed to this item. We’ve updated the remaining amount; please review your entry.',
      rate: 'Please wait a little before sending another message.', invalid: 'Please enter a valid amount, no greater than the remaining amount.', close: 'Close',
      total: 'Shared with love', saved: 'Gift recorded', connection: 'Checking the latest gifts…'
    },
    fr: {
      eyebrow: 'Un petit bout de notre aventure', title: 'Notre rêve de voyage',
      intro: 'Pour ceux qui souhaitent participer, nous préparons notre voyage de noces au Japon. Nous espérons y découvrir ensemble de magnifiques paysages, sa gastronomie et sa culture.',
      invitation: 'Voici quelques moments dont nous rêvons. Si le cœur vous en dit, vous pouvez nous aider à en réaliser un, en entier ou avec une petite participation.',
      optional: 'Votre présence est déjà le plus beau cadeau.',
      browse: 'De petits moments, de grands souvenirs', browseSub: 'Choisissez un moment pour en savoir plus.',
      titles: ['Une escale pour nous deux', 'Le Japon au fil des rails', 'Le début de notre aventure', 'Les saveurs du Japon', 'Une parenthèse de douceur', 'Encore un petit Pokémon…', 'Un petit coup de pouce au voyage'],
      tags: ['Hôtel', 'JR Pass', 'Vols', 'Restaurants', 'Onsen', 'Pokémon', 'Un cadeau à votre mesure'],
      descriptions: ['Se réveiller doucement, découvrir un nouveau quartier et se sentir chez soi, loin de chez nous.', 'Des lumières des villes aux paysages de montagne, une place côté fenêtre pour tout découvrir.', 'Deux places, un long vol et le bonheur de partir découvrir un nouveau pays ensemble.', 'Une petite échoppe de ramen, un comptoir à sushis, un repas dont on reparlera longtemps.', 'Une eau chaude, un cadre paisible et le temps de savourer l’instant.', 'Quelques souvenirs absolument indispensables. Promis… enfin, on essaiera de rester raisonnables.', 'Pour une découverte imprévue, un petit détour ou une belle surprise en chemin.'],
      any: 'Montant libre', infinite: '∞ · sans limite', covered: 'Entièrement offert', coveredThanks: 'Un rêve réalisé grâce à vous',
      raised: 'offerts', remaining: 'restants', open: 'Découvrir ce moment',
      methods: 'Offrir un peu de ce souvenir', methodsBody: 'Si vous souhaitez participer, choisissez l’option qui vous convient. Chaque petite attention compte tout autant.',
      reference: 'Si possible, indiquez le nom du cadeau dans le libellé du virement.',
      record: 'Vous avez participé ? Ajoutez un message', recordIntro: 'Après votre virement, indiquez votre participation et laissez-nous un petit mot.',
      part: 'Une petite participation', full: 'Offrir le montant restant', amount: 'Votre participation (€)',
      amountHint: 'Avec PayNow, indiquez l’équivalent approximatif en euros pour garder un suivi cohérent.',
      name: 'Votre nom', nameHint: 'Facultatif', message: 'Un petit mot pour nous',
      private: 'Votre nom et votre message restent privés, pour nous deux. Seul le total des participations est partagé.',
      confirm: 'J’ai déjà effectué ce virement.', save: 'Envoyer notre cadeau et notre message', saving: 'Enregistrement…',
      success: 'Merci de faire partie de notre aventure. Votre participation et votre message ont bien été enregistrés.',
      selfReported: 'La progression reflète les participations déclarées par nos invités.',
      loading: 'Nous rassemblons les petits bouts de notre voyage…', unavailable: 'Le suivi des participations est momentanément indisponible. Merci de revenir avant d’offrir un cadeau.',
      retry: 'Réessayer', error: 'Votre message n’a pas pu être enregistré. Réessayez : aucun virement n’a été effectué par le site.',
      conflict: 'Une autre personne vient de participer. Le montant restant a été actualisé : vérifiez votre saisie.',
      rate: 'Patientez un peu avant d’envoyer un autre message.', invalid: 'Indiquez un montant valide, sans dépasser le montant restant.', close: 'Fermer',
      total: 'Offerts avec amour', saved: 'Cadeau enregistré', connection: 'Vérification des dernières participations…'
    },
    mr: {
      eyebrow: 'आमच्या प्रवासातील एक सुंदर क्षण', title: 'आमचे प्रवासाचे स्वप्न',
      intro: 'भेट देऊ इच्छिणाऱ्यांसाठी, आम्ही जपानमधील मधुचंद्रासाठी बचत करत आहोत. तिथले सुंदर निसर्ग, खाद्यसंस्कृती आणि परंपरा एकत्र अनुभवण्याची आमची इच्छा आहे.',
      invitation: 'आम्ही पाहत असलेली ही काही छोटी स्वप्ने. तुमची इच्छा असेल तर एखाद्या अनुभवासाठी पूर्ण किंवा थोडे योगदान देऊ शकता.',
      optional: 'तुमची उपस्थिती हीच आमच्यासाठी सर्वात सुंदर भेट.',
      browse: 'छोटे क्षण, कायमच्या आठवणी', browseSub: 'अधिक जाणून घेण्यासाठी एखादा अनुभव निवडा.',
      titles: ['निवांत मुक्काम', 'रेल्वेने जपानची सफर', 'आमच्या प्रवासाची सुरुवात', 'जपानच्या चवी', 'निवांतपणाचा एक क्षण', 'आणखी एक पोकेमॉन…', 'आमच्या प्रवासासाठी तुमची भेट'],
      tags: ['हॉटेल', 'JR Pass', 'विमानप्रवास', 'रेस्टॉरंट', 'ओन्सेन', 'पोकेमॉन', 'तुमच्या इच्छेनुसार भेट'],
      descriptions: ['नव्या परिसरात फिरणे आणि घरापासून दूर असूनही घरासारखे वाटणारा मुक्काम.', 'शहरांच्या रोषणाईपासून डोंगरांच्या दृश्यांपर्यंत, खिडकीतून दिसणारा सुंदर जपान.', 'दोन जागा, एक लांब विमानप्रवास आणि एकत्र नव्या देशात जाण्याचा आनंद.', 'रामेनचे छोटे दुकान, सुशी आणि कायम लक्षात राहील असे एखादे जेवण.', 'गरम पाणी, शांत परिसर आणि एकत्र निवांत वेळ.', 'काही अगदी आवश्यक आठवणींच्या वस्तू! किती घ्यायच्या हे मात्र सांगता येणार नाही.', 'एखादा अनपेक्षित शोध, छोटीशी भटकंती किंवा प्रवासातील सुंदर आश्चर्य.'],
      any: 'इच्छेनुसार रक्कम', infinite: '∞ · मर्यादा नाही', covered: 'पूर्ण योगदान मिळाले', coveredThanks: 'तुमच्या प्रेमाने साकारलेले स्वप्न',
      raised: 'योगदान', remaining: 'बाकी', open: 'हा अनुभव पाहा',
      methods: 'या आठवणीचा भाग व्हा', methodsBody: 'सहभागी व्हायचे असल्यास तुमच्या सोयीचा पर्याय निवडा. प्रत्येक छोटी भेटही आमच्यासाठी मोलाची आहे.',
      reference: 'शक्य असल्यास पैसे पाठवताना भेटीचे नाव नमूद करा.',
      record: 'योगदान दिले आहे? संदेश लिहा', recordIntro: 'पैसे पाठवल्यानंतर तुमच्या भेटीची माहिती आणि आमच्यासाठी एक छोटा संदेश लिहा.',
      part: 'थोडे योगदान', full: 'उरलेली संपूर्ण रक्कम', amount: 'तुमचे योगदान (€)',
      amountHint: 'PayNow वापरल्यास, प्रगती योग्य दिसण्यासाठी युरोमधील अंदाजे समतुल्य रक्कम लिहा.',
      name: 'तुमचे नाव', nameHint: 'ऐच्छिक', message: 'आमच्यासाठी छोटा संदेश',
      private: 'तुमचे नाव आणि संदेश फक्त आम्हा दोघांनाच दिसतील. इतरांना केवळ एकूण योगदान दिसेल.',
      confirm: 'मी हे पैसे आधीच पाठवले आहेत.', save: 'भेट आणि संदेश नोंदवा', saving: 'नोंदवत आहोत…',
      success: 'आमच्या प्रवासाचा भाग झाल्याबद्दल धन्यवाद. तुमची भेट आणि संदेश नोंदवला आहे.',
      selfReported: 'पाहुण्यांनी नोंदवलेल्या योगदानानुसार प्रगती दर्शवली जाते.',
      loading: 'आमच्या प्रवासातील भेटींची माहिती आणत आहोत…', unavailable: 'योगदानाची माहिती सध्या उपलब्ध नाही. भेट देण्यापूर्वी कृपया पुन्हा तपासा.',
      retry: 'पुन्हा प्रयत्न करा', error: 'संदेश नोंदवता आला नाही. कृपया पुन्हा प्रयत्न करा. साइटने कोणतेही पैसे पाठवलेले नाहीत.',
      conflict: 'नुकतेच दुसरे योगदान मिळाले आहे. उरलेली रक्कम बदलली आहे; कृपया पुन्हा तपासा.',
      rate: 'दुसरा संदेश पाठवण्यापूर्वी थोडा वेळ थांबा.', invalid: 'कृपया योग्य रक्कम लिहा. ती उरलेल्या रकमेपेक्षा जास्त नसावी.', close: 'बंद करा',
      total: 'प्रेमाने मिळालेल्या भेटी', saved: 'भेट नोंदवली', connection: 'नवीन योगदान तपासत आहोत…'
    }
  };
  // Keep translated labels aligned with the gallery's flights-first order.
  for (const language of Object.values(copy)) {
    for (const field of ['titles', 'tags', 'descriptions']) {
      language[field] = [2, 0, 1, 3, 4, 5, 6].map(index => language[field][index]);
    }
  }
  let cleanup = () => {};
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  function render(language) {
    cleanup();
    const c = copy[language] || copy.en;
    return `<header class="honeymoon-intro"><h1 id="gift-collection-title" tabindex="-1">${c.title}</h1><p class="gift-optional">${c.optional}</p></header><section class="gift-collection" aria-labelledby="gift-collection-title"><div id="gift-status" class="gift-status" role="status">${c.loading}</div><div class="gift-grid" id="gift-grid"></div><p class="gift-progress-note">${c.selfReported}</p></section>`;
  }

  function mount(language, translate, paymentMarkup) {
    const c = copy[language] || copy.en;
    const root = document.getElementById('gift-grid');
    const status = document.getElementById('gift-status');
    if (!root) return;
    const controller = new AbortController();
    const signal = controller.signal;
    let amounts = {}, available = false, active = null, opener = null, stopped = false;
    let draftId = null, submitting = false, pendingPayload = null, refreshPromise = null;
    const money = cents => new Intl.NumberFormat({ en: 'en-IE', fr: 'fr-FR', mr: 'mr-IN' }[language], { style: 'currency', currency: 'EUR', maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
    const total = gift => amounts[gift.id] || 0;
    const full = gift => gift.target !== null && total(gift) >= gift.target;
    const remaining = gift => Math.max(0, gift.target - total(gift));
    const price = gift => gift.target !== null ? money(gift.target) : gift.id === 'pokemon' ? c.infinite : c.any;
    const progress = gift => gift.target !== null
      ? `<div class="gift-progress" role="progressbar" aria-label="${escape(c.tags[gifts.indexOf(gift)])}" aria-valuemin="0" aria-valuemax="${gift.target / 100}" aria-valuenow="${Math.min(total(gift), gift.target) / 100}" aria-valuetext="${escape(money(total(gift)) + ' / ' + money(gift.target))}"><span style="width:${Math.min(100, total(gift) / gift.target * 100)}%"></span></div><div class="gift-progress-label"><span>${money(total(gift))} ${c.raised}</span><span>${full(gift) ? '✧' : money(remaining(gift)) + ' ' + c.remaining}</span></div>`
      : `<div class="gift-open-total">${total(gift) ? money(total(gift)) + ' · ' + c.total : c.any}</div>`;
    function draw() {
      root.innerHTML = gifts.map((gift, i) => `<article class="gift-card${full(gift) ? ' is-funded' : ''}${gift.id === 'together' ? ' gift-card-open' : ''}"><button class="gift-card-button" type="button" data-gift="${gift.id}" ${!available || full(gift) ? 'disabled' : ''} aria-label="${escape(c.tags[i] + ' — ' + (full(gift) ? c.covered : c.open))}"><div class="gift-card-photo"><img src="${gift.image}" alt="${escape(c.tags[i])}" loading="lazy"><span class="gift-price">${price(gift)}</span>${full(gift) ? `<span class="gift-funded-badge">✧ ${c.covered}</span>` : ''}</div><div class="gift-card-copy"><div class="gift-card-tag">${c.tags[i]} <span aria-hidden="true">${full(gift) ? '✧' : '↗'}</span></div><h2>${c.titles[i]}</h2><p>${c.descriptions[i]}</p>${available ? progress(gift) : '<span class="gift-progress-placeholder" aria-hidden="true"></span>'}${full(gift) ? `<p class="gift-funded-thanks">${c.coveredThanks}</p>` : ''}</div></button></article>`).join('');
    }
    const dialog = document.createElement('dialog');
    dialog.className = 'gift-dialog';
    document.body.appendChild(dialog);
    function close() {
      if (dialog.open) dialog.close();
      document.body.classList.remove('gift-dialog-open');
      active = null;
      const next = opener?.dataset.gift ? root.querySelector(`[data-gift="${opener.dataset.gift}"]`) : null;
      if (next && !next.disabled) next.focus(); else document.getElementById('gift-collection-title')?.focus({ preventScroll: true });
    }
    function updateActiveProgress() {
      if (!active || !dialog.open) return;
      dialog.querySelector('.gift-dialog-progress').innerHTML = progress(active);
      dialog.querySelector('.gift-payment-area').hidden = !available || full(active);
      dialog.querySelector('.gift-record-toggle')?.toggleAttribute('disabled', !available || full(active));
      if (full(active) && !submitting) {
        dialog.querySelector('.gift-payment-area').hidden = true;
        const record = dialog.querySelector('.gift-record');
        if (!record.querySelector('.gift-success')) record.innerHTML = `<p class="gift-success" role="status">✧ ${c.covered}. ${c.coveredThanks}.</p>`;
      }
    }
    async function refresh() {
      if (refreshPromise) return refreshPromise;
      refreshPromise = (async () => {
        try {
          const response = await fetch('/api/gifts', { cache: 'no-store', signal });
          if (!response.ok) throw new Error('Unavailable');
          const data = await response.json();
          if (!Array.isArray(data.gifts)) throw new Error('Invalid response');
          for (const gift of gifts) {
            const row = data.gifts.find(row => row.id === gift.id);
            if (!row || !Number.isSafeInteger(row.contributedCents) || row.contributedCents < 0) throw new Error('Invalid total');
          }
          const nextAmounts = Object.fromEntries(data.gifts.map(row => [row.id, row.contributedCents]));
          const changed = !available || gifts.some(gift => amounts[gift.id] !== nextAmounts[gift.id]);
          amounts = nextAmounts;
          available = true;
          status.hidden = true;
          if (changed) draw();
          updateActiveProgress();
          return true;
        } catch (error) {
          if (stopped) return false;
          available = false;
          status.hidden = false;
          status.innerHTML = `<span>${c.unavailable}</span> <button type="button" class="gift-text-button" data-retry>${c.retry}</button>`;
          draw();
          // Never leave stale payment instructions actionable during an outage.
          if (active && dialog.open) {
            dialog.querySelector('.gift-payment-area').hidden = true;
            const errorNode = dialog.querySelector('.gift-form-error');
            if (errorNode) { errorNode.textContent = c.unavailable; errorNode.hidden = false; }
          }
          return false;
        }
      })().finally(() => { refreshPromise = null; });
      return refreshPromise;
    }
    async function open(gift, button) {
      if (!available || full(gift)) return;
      opener = button;
      const from = button.querySelector('img').getBoundingClientRect();
      const i = gifts.indexOf(gift);
      active = gift;
      draftId = crypto.randomUUID();
      pendingPayload = null;
      dialog.setAttribute('aria-labelledby', 'gift-dialog-title');
      dialog.innerHTML = `<button class="gift-close" type="button" aria-label="${c.close}">×</button><div class="gift-dialog-top"><div class="gift-dialog-image"><img src="${gift.image}" alt="${escape(c.tags[i])}"><span class="gift-dialog-image-label">${c.tags[i]}</span></div><div class="gift-dialog-details"><p class="eyebrow">${c.tags[i]} · ${price(gift)}</p><h2 id="gift-dialog-title">${c.titles[i]}</h2><p>${c.descriptions[i]}</p><div class="gift-dialog-progress">${progress(gift)}</div><div class="gift-payment-area" hidden><h3>${c.methods}</h3>${paymentMarkup()}<p class="gift-transfer-note">${translate('giftNote')}</p></div><p class="gift-checking" role="status">${c.connection}</p><div class="gift-record"><button class="gift-record-toggle" type="button" aria-expanded="false" aria-controls="gift-contribution-form">${c.record} <span aria-hidden="true">＋</span></button><form id="gift-contribution-form" class="gift-contribution-form" hidden><p>${c.recordIntro}</p>${gift.target !== null ? `<fieldset class="gift-coverage"><legend class="visually-hidden">${c.amount}</legend><label><input type="radio" name="coverage" value="partial" checked> ${c.part}</label><label><input type="radio" name="coverage" value="full"> ${c.full}</label></fieldset>` : ''}<div class="gift-form-row"><label>${c.amount}<input type="number" name="amount" min="0.01" step="0.01" inputmode="decimal" required ${gift.target !== null ? 'max="' + remaining(gift) / 100 + '"' : ''}></label><label>${c.name} <span>(${c.nameHint})</span><input type="text" name="name" maxlength="100" autocomplete="name"></label></div><p class="gift-field-hint">${c.amountHint}</p><label>${c.message} <span>(${c.nameHint})</span><textarea name="message" rows="3" maxlength="1000"></textarea></label><p class="gift-field-hint">${c.private}</p><label class="gift-transfer-confirm"><input type="checkbox" name="transferred" required> ${c.confirm}</label><div class="gift-honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><p class="gift-form-error" role="alert" hidden></p><button class="gift-submit" type="submit">${c.save}</button></form></div></div></div>`;
      const image = dialog.querySelector('.gift-dialog-image');
      const sourceImage = button.querySelector('img');
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (document.startViewTransition && !reducedMotion) {
        sourceImage.style.viewTransitionName = 'gift-photo';
        const transition = document.startViewTransition(() => {
          sourceImage.style.viewTransitionName = '';
          image.querySelector('img').style.viewTransitionName = 'gift-photo';
          dialog.showModal();
          document.body.classList.add('gift-dialog-open');
        });
        await transition.updateCallbackDone;
        transition.finished.finally(() => {
          sourceImage.style.viewTransitionName = '';
          image.querySelector('img').style.viewTransitionName = '';
        });
      } else {
        dialog.showModal();
        document.body.classList.add('gift-dialog-open');
        const to = image.getBoundingClientRect();
        if (!reducedMotion && from.width && to.width) {
          image.animate([{ transform: `translate(${from.left - to.left}px,${from.top - to.top}px) scale(${from.width / to.width},${from.height / to.height})`, borderRadius: '10px' }, { transform: 'none', borderRadius: '0px' }], { duration: 540, easing: 'cubic-bezier(.22,1,.36,1)' });
        }
      }
      // Recheck before exposing payment details, since another guest may have funded it.
      const fresh = await refresh();
      if (active !== gift || !dialog.open) return;
      dialog.querySelector('.gift-checking').hidden = true;
      dialog.querySelector('.gift-payment-area').hidden = !fresh || full(gift);
      dialog.querySelector('.gift-record-toggle')?.toggleAttribute('disabled', !fresh || full(gift));
    }
    root.addEventListener('click', event => {
      const button = event.target.closest('[data-gift]');
      if (button && !button.disabled) open(gifts.find(gift => gift.id === button.dataset.gift), button);
    }, { signal });
    status.addEventListener('click', event => { if (event.target.closest('[data-retry]')) refresh(); }, { signal });
    dialog.addEventListener('cancel', event => { event.preventDefault(); if (!submitting) close(); }, { signal });
    dialog.addEventListener('click', event => {
      if (event.target.closest('.gift-close') || event.target === dialog) { if (!submitting) close(); return; }
      const toggle = event.target.closest('.gift-record-toggle');
      if (toggle) {
        const form = dialog.querySelector('form');
        form.hidden = !form.hidden;
        toggle.setAttribute('aria-expanded', String(!form.hidden));
        if (!form.hidden) form.querySelector('input[name="amount"]').focus();
      }
    }, { signal });
    dialog.addEventListener('change', event => {
      if (event.target.name === 'coverage') {
        const input = dialog.querySelector('[name="amount"]');
        const isFull = event.target.value === 'full';
        input.readOnly = isFull;
        input.value = isFull ? (remaining(active) / 100).toFixed(2) : '';
      }
    }, { signal });
    dialog.addEventListener('submit', async event => {
      event.preventDefault();
      if (submitting || !active) return;
      const gift = active, form = event.target;
      const fields = new FormData(form);
      const errorNode = form.querySelector('.gift-form-error');
      const cents = Math.round(Number(fields.get('amount')) * 100);
      errorNode.hidden = true;
      if (!Number.isSafeInteger(cents) || cents <= 0 || (gift.target !== null && cents > remaining(gift))) {
        errorNode.textContent = c.invalid; errorNode.hidden = false; return;
      }
      const submit = form.querySelector('[type="submit"]');
      const payload = { id: draftId, giftId: gift.id, amountCents: cents, coverage: fields.get('coverage') || 'partial', name: fields.get('name'), message: fields.get('message'), transferred: fields.get('transferred') === 'on', website: fields.get('website') };
      // Reuse this exact request after uncertain network results, even if the form changes.
      if (!pendingPayload) pendingPayload = payload;
      submitting = true;
      submit.disabled = true; submit.textContent = c.saving;
      dialog.querySelector('.gift-close').disabled = true;
      try {
        const response = await fetch('/api/gifts/contributions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pendingPayload), signal });
        if (!response.ok) {
          if (response.status === 409) {
            pendingPayload = null;
            await refresh();
            const amount = form.querySelector('[name="amount"]');
            if (amount) { amount.max = remaining(gift) / 100; amount.readOnly = false; }
            form.querySelector('[value="partial"]')?.click();
            throw new Error(c.conflict);
          }
          if (response.status === 429) throw new Error(c.rate);
          if (response.status === 400) { pendingPayload = null; throw new Error(c.invalid); }
          throw new Error(c.error);
        }
        const result = await response.json();
        if (result.ok !== true) throw new Error(c.error);
        dialog.querySelector('.gift-record').innerHTML = `<div class="gift-success" role="status"><span aria-hidden="true">✧</span><h3>${c.saved}</h3><p>${c.success}</p></div>`;
        await refresh();
      } catch (error) {
        if (!stopped && errorNode.isConnected) { errorNode.textContent = error.message === 'Failed to fetch' ? c.error : error.message; errorNode.hidden = false; }
      } finally {
        submitting = false;
        if (submit.isConnected) { submit.disabled = false; submit.textContent = c.save; }
        if (dialog.isConnected) dialog.querySelector('.gift-close').disabled = false;
        updateActiveProgress();
      }
    }, { signal });
    // Refresh on return to the page and periodically, without replacing a guest's draft.
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); }, { signal });
    const interval = setInterval(() => { if (!document.hidden && !submitting) refresh(); }, 30000);
    cleanup = () => { stopped = true; controller.abort(); clearInterval(interval); dialog.remove(); document.body.classList.remove('gift-dialog-open'); };
    draw();
    refresh();
  }
  return { render, mount };
})();
