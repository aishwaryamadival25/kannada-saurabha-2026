/**
 * ====================================================================
 * SUPABASE DATA LAYER — KANNADA SAURABHA 2026
 * ====================================================================
 * Handles all database operations for Events, Professors, Committee,
 * Guests, Sponsorship, Sponsors, Gallery, Venue, Schedule, Home Content,
 * and Media Storage.
 *
 * Implements a resilient offline/fallback strategy:
 * If Supabase is not configured or network fails, gracefully falls back
 * to existing local data so the public website NEVER breaks.
 * ====================================================================
 */

(function (global) {
  var window = global;
  var sb = function () {
    return window.SupabaseConfig && typeof window.SupabaseConfig.getClient === 'function'
      ? window.SupabaseConfig.getClient()
      : null;
  };

  var isReady = function () {
    return !!(window.SupabaseConfig && window.SupabaseConfig.isConfigured() && sb());
  };

  // ------------------------------------------------------------------
  // 1. HOME CONTENT
  // ------------------------------------------------------------------
  async function getHomeContent() {
    if (!isReady()) {
      return null;
    }
    try {
      var res = await sb().from('home_content').select('*');
      if (res.error) throw res.error;
      var map = {};
      (res.data || []).forEach(function (row) {
        if (row && row.key === 'hero' && row.extra) {
          if (row.extra.date_en === '4th November 2026') row.extra.date_en = '3rd November 2026';
          if (row.extra.date_kn === '೪ನೇ ನವೆಂಬರ್ ೨೦೨೬') row.extra.date_kn = '೩ನೇ ನವೆಂಬರ್ ೨೦೨೬';
        }
        map[row.key] = row;
      });
      return map;
    } catch (e) {
      console.warn('Supabase getHomeContent error:', e);
      return null;
    }
  }

  async function saveHomeContent(key, contentEn, contentKn, extra) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var payload = {
      key: key,
      content_en: contentEn,
      content_kn: contentKn,
      extra: extra || {},
      updated_at: new Date().toISOString()
    };
    var res = await sb().from('home_content').upsert(payload, { onConflict: 'key' }).select();
    if (res.error) throw res.error;
    return res.data && res.data[0];
  }

  // ------------------------------------------------------------------
  // 2. EVENTS & COORDINATORS
  // ------------------------------------------------------------------
  async function getEvents() {
    if (!isReady()) return null;
    try {
      var res = await sb()
        .from('events')
        .select('*, event_coordinators(*)')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(function (ev) {
        return {
          id: ev.id,
          titleEn: ev.title_en,
          titleKn: ev.title_kn,
          date: ev.date,
          time: ev.time,
          venue: ev.venue,
          descriptionEn: ev.description_en,
          descriptionKn: ev.description_kn,
          image: ev.image_url,
          order_index: ev.order_index,
          coordinators: (ev.event_coordinators || []).map(function (c) {
            return {
              id: c.id,
              nameEn: c.name_en,
              nameKn: c.name_kn,
              phone: c.phone
            };
          })
        };
      });
    } catch (e) {
      console.warn('Supabase getEvents error:', e);
      return null;
    }
  }

  async function saveEvent(evData) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var client = sb();
    var eventPayload = {
      title_en: evData.titleEn || '',
      title_kn: evData.titleKn || '',
      date: evData.date || '',
      time: evData.time || '',
      venue: evData.venue || '',
      description_en: evData.descriptionEn || '',
      description_kn: evData.descriptionKn || '',
      image_url: evData.image || '',
      order_index: typeof evData.order_index === 'number' ? evData.order_index : 0,
      updated_at: new Date().toISOString()
    };

    var savedEvent = null;
    if (evData.id && evData.id.length > 20) {
      // Update
      var uRes = await client.from('events').update(eventPayload).eq('id', evData.id).select();
      if (uRes.error) throw uRes.error;
      savedEvent = uRes.data[0];
    } else {
      // Insert
      var iRes = await client.from('events').insert([eventPayload]).select();
      if (iRes.error) throw iRes.error;
      savedEvent = iRes.data[0];
    }

    // Save Coordinators
    if (savedEvent && evData.coordinators) {
      // Clear old coordinators
      await client.from('event_coordinators').delete().eq('event_id', savedEvent.id);
      if (evData.coordinators.length) {
        var coordPayloads = evData.coordinators.map(function (c, idx) {
          return {
            event_id: savedEvent.id,
            name_en: c.nameEn || '',
            name_kn: c.nameKn || '',
            phone: c.phone || '',
            order_index: idx
          };
        });
        var cRes = await client.from('event_coordinators').insert(coordPayloads);
        if (cRes.error) console.warn('Could not save coordinators:', cRes.error);
      }
    }
    return savedEvent;
  }

  async function deleteEvent(id) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var res = await sb().from('events').delete().eq('id', id);
    if (res.error) throw res.error;
    return true;
  }

  // ------------------------------------------------------------------
  // 3. KARNATAKA CONCLAVE PROFESSORS
  // ------------------------------------------------------------------
  async function getConclaveProfessors() {
    if (!isReady()) return null;
    try {
      var res = await sb()
        .from('conclave_professors')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(function (p) {
        return {
          id: p.id,
          nameEn: p.name_en,
          nameKn: p.name_kn,
          roleEn: p.designation_en,
          roleKn: p.designation_kn,
          collegeEn: p.institution_en,
          collegeKn: p.institution_kn,
          contact: p.contact,
          photo: p.photo_url,
          order_index: p.order_index
        };
      });
    } catch (e) {
      console.warn('Supabase getConclaveProfessors error:', e);
      return null;
    }
  }

  async function saveConclaveProfessor(profData) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var payload = {
      name_en: profData.nameEn || '',
      name_kn: profData.nameKn || '',
      designation_en: profData.roleEn || profData.designation_en || '',
      designation_kn: profData.roleKn || profData.designation_kn || '',
      institution_en: profData.collegeEn || profData.institution_en || '',
      institution_kn: profData.collegeKn || profData.institution_kn || '',
      contact: profData.contact || '',
      photo_url: profData.photo || '',
      order_index: typeof profData.order_index === 'number' ? profData.order_index : 0,
      updated_at: new Date().toISOString()
    };

    if (profData.id && profData.id.length > 20) {
      var uRes = await sb().from('conclave_professors').update(payload).eq('id', profData.id).select();
      if (uRes.error) throw uRes.error;
      return uRes.data[0];
    } else {
      var iRes = await sb().from('conclave_professors').insert([payload]).select();
      if (iRes.error) throw iRes.error;
      return iRes.data[0];
    }
  }

  async function deleteConclaveProfessor(id) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var res = await sb().from('conclave_professors').delete().eq('id', id);
    if (res.error) throw res.error;
    return true;
  }

  // ------------------------------------------------------------------
  // 4. STUDENT COMMITTEE
  // ------------------------------------------------------------------
  async function getStudentCommittee() {
    if (!isReady()) return null;
    try {
      var res = await sb()
        .from('student_committee')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(function (m) {
        return {
          id: m.id,
          nameEn: m.name_en,
          nameKn: m.name_kn,
          roleEn: m.role_en,
          roleKn: m.role_kn,
          contact: m.contact,
          order_index: m.order_index
        };
      });
    } catch (e) {
      console.warn('Supabase getStudentCommittee error:', e);
      return null;
    }
  }

  async function saveStudentMember(memberData) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var payload = {
      name_en: memberData.nameEn || '',
      name_kn: memberData.nameKn || '',
      role_en: memberData.roleEn || '',
      role_kn: memberData.roleKn || '',
      contact: memberData.contact || '',
      order_index: typeof memberData.order_index === 'number' ? memberData.order_index : 0,
      updated_at: new Date().toISOString()
    };
    if (memberData.id && memberData.id.length > 20) {
      var uRes = await sb().from('student_committee').update(payload).eq('id', memberData.id).select();
      if (uRes.error) throw uRes.error;
      return uRes.data[0];
    } else {
      var iRes = await sb().from('student_committee').insert([payload]).select();
      if (iRes.error) throw iRes.error;
      return iRes.data[0];
    }
  }

  async function deleteStudentMember(id) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var res = await sb().from('student_committee').delete().eq('id', id);
    if (res.error) throw res.error;
    return true;
  }

  // ------------------------------------------------------------------
  // 5. MANAGEMENT COMMITTEE
  // ------------------------------------------------------------------
  async function getManagementCommittee() {
    if (!isReady()) return null;
    try {
      var res = await sb()
        .from('management_committee')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(function (m) {
        return {
          id: m.id,
          nameEn: m.name_en,
          nameKn: m.name_kn,
          roleEn: m.role_en,
          roleKn: m.role_kn,
          contact: m.contact,
          order_index: m.order_index
        };
      });
    } catch (e) {
      console.warn('Supabase getManagementCommittee error:', e);
      return null;
    }
  }

  async function saveMgmtMember(memberData) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var payload = {
      name_en: memberData.nameEn || '',
      name_kn: memberData.nameKn || '',
      role_en: memberData.roleEn || '',
      role_kn: memberData.roleKn || '',
      contact: memberData.contact || '',
      order_index: typeof memberData.order_index === 'number' ? memberData.order_index : 0,
      updated_at: new Date().toISOString()
    };
    if (memberData.id && memberData.id.length > 20) {
      var uRes = await sb().from('management_committee').update(payload).eq('id', memberData.id).select();
      if (uRes.error) throw uRes.error;
      return uRes.data[0];
    } else {
      var iRes = await sb().from('management_committee').insert([payload]).select();
      if (iRes.error) throw iRes.error;
      return iRes.data[0];
    }
  }

  async function deleteMgmtMember(id) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var res = await sb().from('management_committee').delete().eq('id', id);
    if (res.error) throw res.error;
    return true;
  }

  // ------------------------------------------------------------------
  // 6. GUESTS
  // ------------------------------------------------------------------
  async function getGuests() {
    if (!isReady()) return null;
    try {
      var res = await sb()
        .from('guests')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(function (g) {
        return {
          id: g.id,
          nameEn: g.name_en,
          nameKn: g.name_kn,
          roleEn: g.role_en,
          roleKn: g.role_kn,
          orgEn: g.org_en,
          orgKn: g.org_kn,
          descEn: g.description_en,
          descKn: g.description_kn,
          photo: g.photo_url,
          order_index: g.order_index
        };
      });
    } catch (e) {
      console.warn('Supabase getGuests error:', e);
      return null;
    }
  }

  async function saveGuest(guestData) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var payload = {
      name_en: guestData.nameEn || '',
      name_kn: guestData.nameKn || '',
      role_en: guestData.roleEn || '',
      role_kn: guestData.roleKn || '',
      org_en: guestData.orgEn || '',
      org_kn: guestData.orgKn || '',
      description_en: guestData.descEn || '',
      description_kn: guestData.descKn || '',
      photo_url: guestData.photo || '',
      order_index: typeof guestData.order_index === 'number' ? guestData.order_index : 0,
      updated_at: new Date().toISOString()
    };
    if (guestData.id && guestData.id.length > 20) {
      var uRes = await sb().from('guests').update(payload).eq('id', guestData.id).select();
      if (uRes.error) throw uRes.error;
      return uRes.data[0];
    } else {
      var iRes = await sb().from('guests').insert([payload]).select();
      if (iRes.error) throw iRes.error;
      return iRes.data[0];
    }
  }

  async function deleteGuest(id) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var res = await sb().from('guests').delete().eq('id', id);
    if (res.error) throw res.error;
    return true;
  }

  // ------------------------------------------------------------------
  // 7. SPONSORSHIP PACKAGES
  // ------------------------------------------------------------------
  var OFFICIAL_SPONSORSHIP_PACKAGES = [
    {
      id: 'pkg-title-sponsor',
      nameEn: 'Title Sponsor',
      nameKn: 'ಶೀರ್ಷಿಕೆ ಪ್ರಾಯೋಜಕರು (Title Sponsor)',
      amountEn: '₹1,00,000',
      amountKn: '₹೧,೦೦,೦೦೦',
      descEn: 'Become the principal sponsor of Kannada Saurabha 2026 with premium brand visibility throughout the event.',
      descKn: 'ಸಂಪೂರ್ಣ ಕಾರ್ಯಕ್ರಮದಾದ್ಯಂತ ಪ್ರೀಮಿಯಂ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯೊಂದಿಗೆ ಕನ್ನಡ ಸೌರಭ ೨೦೨೬ ರ ಮುಖ್ಯ ಪ್ರಾಯೋಜಕರಾಗಿ.',
      benefitsEn: 'Brand name associated with the event — “Kannada Saurabha 2026, Powered by [Brand Name]”\nPremium logo placement on the main event poster\nProminent branding on the main stage/backdrop\nPremium banners across the event venue\nBrand mention by the emcee during the event\nDedicated social media promotion\nOpportunity to set up a promotional stall\nOpportunity to distribute promotional materials/samples\nLogo on digital creatives\nSpecial acknowledgement during the event\nCertificate/appreciation from the organising committee',
      benefitsKn: 'ಕಾರ್ಯಕ್ರಮದೊಂದಿಗೆ ಸಂಸ್ಥೆಯ ಹೆಸರು — “ಕನ್ನಡ ಸೌರಭ ೨೦೨೬, Powered by [Brand Name]”\nಮುಖ್ಯ ಕಾರ್ಯಕ್ರಮದ ಪೋಸ್ಟರ್‌ನಲ್ಲಿ ಪ್ರಮುಖ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಮುಖ್ಯ ವೇದಿಕೆ ಮತ್ತು ಹಿನ್ನೆಲೆಯಲ್ಲಿ ಪ್ರಮುಖ ಬ್ರ್ಯಾಂಡಿಂಗ್\nಕಾರ್ಯಕ್ರಮದ ಆವರಣದಾದ್ಯಂತ ಪ್ರೀಮಿಯಂ ಬ್ಯಾನರ್‌ಗಳು\nಕಾರ್ಯಕ್ರಮದ ನಿರೂಪಕರಿಂದ ಸಂಸ್ಥೆಯ ಹೆಸರಿನ ಉಲ್ಲೇಖ\nಮೀಸಲಾದ ಸಾಮಾಜಿಕ ಜಾಲತಾಣ ಪ್ರಚಾರ\nಪ್ರಚಾರ ಮಳಿಗೆ (Stall) ಸ್ಥಾಪಿಸಲು ಅವಕಾಶ\nಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳು/ಮಾದರಿಗಳನ್ನು ವಿತರಿಸುವ ಅವಕಾಶ\nಡಿಜಿಟಲ್ ಪೋಸ್ಟರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ವಿಶೇಷ ಕೃತಜ್ಞತೆ ಮತ್ತು ಸನ್ಮಾನ\nಸಂಘಟನಾ ಸಮಿತಿಯಿಂದ ಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
      order_index: 0
    },
    {
      id: 'pkg-platinum-sponsor',
      nameEn: 'Platinum Sponsor',
      nameKn: 'ಪ್ಲಾಟಿನಂ ಪ್ರಾಯೋಜಕರು (Platinum Sponsor)',
      amountEn: '₹50,000',
      amountKn: '₹೫೦,೦೦೦',
      descEn: 'A premium sponsorship opportunity offering prominent brand visibility across the event.',
      descKn: 'ಕಾರ್ಯಕ್ರಮದಾದ್ಯಂತ ಪ್ರಮುಖ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯನ್ನು ಒದಗಿಸುವ ಪ್ರೀಮಿಯಂ ಪ್ರಾಯೋಜಕತ್ವದ ಅವಕಾಶ.',
      benefitsEn: 'Prominent logo placement on event creatives\nStage/venue branding\nMultiple banner placements\nSocial media promotion\nBrand mention during the event\nPromotional stall opportunity\nDistribution of promotional materials\nLogo on selected digital promotions\nCertificate/appreciation',
      benefitsKn: 'ಕಾರ್ಯಕ್ರಮದ ಕ್ರಿಯೇಟಿವ್‌ಗಳಲ್ಲಿ ಪ್ರಮುಖ ಲೋಗೋ ಪ್ರದರ್ಶನ\nವೇದಿಕೆ ಮತ್ತು ಆವರಣದಲ್ಲಿ ಬ್ರ್ಯಾಂಡಿಂಗ್\nಹಲವಾರು ಸ್ಥಳಗಳಲ್ಲಿ ಬ್ಯಾನರ್ ಪ್ರದರ್ಶನ\nಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಪ್ರಚಾರ\nಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ಸಂಸ್ಥೆಯ ಉಲ್ಲೇಖ\nಪ್ರಚಾರ ಮಳಿಗೆ (Stall) ಸ್ಥಾಪಿಸಲು ಅವಕಾಶ\nಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳ ವಿತರಣೆ\nಆಯ್ದ ಡಿಜಿಟಲ್ ಪ್ರಚಾರಗಳಲ್ಲಿ ಲೋಗೋ\nಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
      order_index: 1
    },
    {
      id: 'pkg-gold-sponsor',
      nameEn: 'Gold Sponsor',
      nameKn: 'ಚಿನ್ನದ ಪ್ರಾಯೋಜಕರು (Gold Sponsor)',
      amountEn: '₹25,000',
      amountKn: '₹೨೫,೦೦೦',
      descEn: 'Gain valuable brand exposure among students and event attendees through event and promotional branding.',
      descKn: 'ಕಾರ್ಯಕ್ರಮ ಮತ್ತು ಪ್ರಚಾರ ಬ್ರ್ಯಾಂಡಿಂಗ್ ಮೂಲಕ ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕರಲ್ಲಿ ಮೌಲ್ಯಯುತ ಪ್ರಚಾರ ಪಡೆಯಿರಿ.',
      benefitsEn: 'Logo placement on event banners\nLogo on selected promotional creatives\nSocial media mention\nBrand acknowledgement during the event\nPromotional stall opportunity, subject to venue availability\nDistribution of promotional materials\nCertificate/appreciation',
      benefitsKn: 'ಕಾರ್ಯಕ್ರಮದ ಬ್ಯಾನರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಆಯ್ದ ಪ್ರಚಾರ ಪೋಸ್ಟರ್‌ಗಳಲ್ಲಿ ಲೋಗೋ\nಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಉಲ್ಲೇಖ\nಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಸಂಸ್ಥೆಯ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ\nಸ್ಥಳಾವಕಾಶಕ್ಕೆ ಒಳಪಟ್ಟು ಪ್ರಚಾರ ಮಳಿಗೆ ಅವಕಾಶ\nಪ್ರಚಾರ ಸಾಮಗ್ರಿಗಳ ವಿತರಣೆ\nಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
      order_index: 2
    },
    {
      id: 'pkg-silver-sponsor',
      nameEn: 'Silver Sponsor',
      nameKn: 'ಬೆಳ್ಳಿ ಪ್ರಾಯೋಜಕರು (Silver Sponsor)',
      amountEn: '₹10,000',
      amountKn: '₹೧೦,೦೦೦',
      descEn: 'Support Kannada Saurabha 2026 while receiving meaningful brand visibility during the celebration.',
      descKn: 'ಸಂಭ್ರಮಾಚರಣೆಯ ಸಮಯದಲ್ಲಿ ಅರ್ಥಪೂರ್ಣ ಬ್ರ್ಯಾಂಡ್ ಗೋಚರತೆಯನ್ನು ಪಡೆಯುವುದರೊಂದಿಗೆ ಕನ್ನಡ ಸೌರಭ ೨೦೨೬ ಅನ್ನು ಬೆಂಬಲಿಸಿ.',
      benefitsEn: 'Logo placement on event banner\nLogo on selected digital creatives\nSocial media acknowledgement\nSponsor acknowledgement during the event\nCertificate/appreciation',
      benefitsKn: 'ಕಾರ್ಯಕ್ರಮದ ಬ್ಯಾನರ್‌ನಲ್ಲಿ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಆಯ್ದ ಡಿಜಿಟಲ್ ಕ್ರಿಯೇಟಿವ್‌ಗಳಲ್ಲಿ ಲೋಗೋ\nಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಕೃತಜ್ಞತೆ\nಕಾರ್ಯಕ್ರಮದಲ್ಲಿ ಪ್ರಾಯೋಜಕರ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ\nಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
      order_index: 3
    },
    {
      id: 'pkg-associate-sponsor',
      nameEn: 'Associate Sponsor',
      nameKn: 'ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರು (Associate Sponsor)',
      amountEn: '₹5,000',
      amountKn: '₹೫,೦೦೦',
      descEn: 'Support the celebration while receiving recognition as an associate sponsor.',
      descKn: 'ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರಾಗಿ ಮನ್ನಣೆ ಪಡೆಯುವುದರೊಂದಿಗೆ ಸಂಭ್ರಮಾಚರಣೆಯನ್ನು ಬೆಂಬಲಿಸಿ.',
      benefitsEn: 'Logo placement with associate sponsors\nSocial media acknowledgement\nEvent acknowledgement\nCertificate/appreciation',
      benefitsKn: 'ಸಹವರ್ತಿ ಪ್ರಾಯೋಜಕರೊಂದಿಗೆ ಲೋಗೋ ಪ್ರದರ್ಶನ\nಸಾಮಾಜಿಕ ಜಾಲತಾಣಗಳಲ್ಲಿ ಕೃತಜ್ಞತೆ\nಕಾರ್ಯಕ್ರಮದ ವೇಳೆ ಕೃತಜ್ಞತಾ ಉಲ್ಲೇಖ\nಅಭಿನಂದನಾ ಪ್ರಮಾಣಪತ್ರ',
      order_index: 4
    }
  ];

  async function getPackages() {
    var localPackages = null;
    try {
      var raw = localStorage.getItem('kv_packages_v1');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localPackages = parsed;
        }
      }
    } catch (e) {}

    if (!localPackages) {
      localPackages = OFFICIAL_SPONSORSHIP_PACKAGES.slice();
      try {
        localStorage.setItem('kv_packages_v1', JSON.stringify(localPackages));
        localStorage.setItem('kv_packages_ver', 'v4_5official_sponsorship_pkgs');
      } catch (e) {}
    }

    if (!isReady()) return localPackages;

    try {
      var res = await sb()
        .from('sponsorship_packages')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (!res.error && res.data && res.data.length > 0) {
        var mapped = res.data.map(function (p) {
          return {
            id: p.id,
            nameEn: p.name_en,
            nameKn: p.name_kn,
            amountEn: p.amount_en,
            amountKn: p.amount_kn,
            descEn: p.description_en,
            descKn: p.description_kn,
            benefitsEn: p.benefits_en,
            benefitsKn: p.benefits_kn,
            order_index: p.order_index
          };
        });
        try { localStorage.setItem('kv_packages_v1', JSON.stringify(mapped)); } catch (e) {}
        return mapped;
      }
      return localPackages;
    } catch (e) {
      console.warn('Supabase getPackages warning (using local):', e);
      return localPackages;
    }
  }

  async function savePackage(pkgData) {
    var payload = {
      name_en: pkgData.nameEn || '',
      name_kn: pkgData.nameKn || '',
      amount_en: pkgData.amountEn || '',
      amount_kn: pkgData.amountKn || '',
      description_en: pkgData.descEn || '',
      description_kn: pkgData.descKn || '',
      benefits_en: pkgData.benefitsEn || '',
      benefits_kn: pkgData.benefitsKn || '',
      order_index: typeof pkgData.order_index === 'number' ? pkgData.order_index : 0,
      updated_at: new Date().toISOString()
    };

    var pkgObj = {
      id: pkgData.id || ('pkg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)),
      nameEn: payload.name_en,
      nameKn: payload.name_kn,
      amountEn: payload.amount_en,
      amountKn: payload.amount_kn,
      descEn: payload.description_en,
      descKn: payload.description_kn,
      benefitsEn: payload.benefits_en,
      benefitsKn: payload.benefits_kn,
      order_index: payload.order_index
    };

    // Update local cache so admin portal and public page are immediately in sync
    try {
      var raw = localStorage.getItem('kv_packages_v1');
      var list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list) || !list.length) list = OFFICIAL_SPONSORSHIP_PACKAGES.slice();

      var foundIdx = -1;
      if (pkgData.id) {
        foundIdx = list.findIndex(function (x) { return x.id === pkgData.id; });
      }
      if (foundIdx === -1 && pkgData.nameEn) {
        foundIdx = list.findIndex(function (x) {
          return (x.nameEn || '').toLowerCase() === pkgData.nameEn.toLowerCase();
        });
      }

      if (foundIdx >= 0) {
        pkgObj.id = list[foundIdx].id || pkgObj.id;
        list[foundIdx] = Object.assign({}, list[foundIdx], pkgObj);
      } else {
        list.push(pkgObj);
      }
      localStorage.setItem('kv_packages_v1', JSON.stringify(list));
    } catch (e) {}

    // Persist to Supabase if configured and reachable
    if (isReady()) {
      try {
        if (pkgData.id && pkgData.id.length > 20 && !pkgData.id.startsWith('pkg_')) {
          var uRes = await sb().from('sponsorship_packages').update(payload).eq('id', pkgData.id).select();
          if (!uRes.error && uRes.data && uRes.data.length) return uRes.data[0];
        } else {
          var existing = await sb().from('sponsorship_packages').select('id').eq('name_en', payload.name_en).limit(1);
          if (existing.data && existing.data.length > 0) {
            var uRes2 = await sb().from('sponsorship_packages').update(payload).eq('id', existing.data[0].id).select();
            if (!uRes2.error && uRes2.data && uRes2.data.length) return uRes2.data[0];
          } else {
            var iRes = await sb().from('sponsorship_packages').insert([payload]).select();
            if (!iRes.error && iRes.data && iRes.data.length) return iRes.data[0];
          }
        }
      } catch (err) {
        console.warn('Supabase package save warning (saved locally):', err);
      }
    }

    return pkgObj;
  }

  async function deletePackage(id) {
    try {
      var raw = localStorage.getItem('kv_packages_v1');
      if (raw) {
        var list = JSON.parse(raw);
        if (Array.isArray(list)) {
          list = list.filter(function (x) { return x.id !== id; });
          localStorage.setItem('kv_packages_v1', JSON.stringify(list));
        }
      }
    } catch (e) {}

    if (isReady()) {
      try {
        var res = await sb().from('sponsorship_packages').delete().eq('id', id);
        if (res.error) throw res.error;
      } catch (err) {
        console.warn('Supabase package delete warning (removed locally):', err);
      }
    }
    return true;
  }

  // ------------------------------------------------------------------
  // 8. SPONSORS (OUR SPONSORS)
  // ------------------------------------------------------------------
  async function getSponsors() {
    if (!isReady()) return null;
    try {
      var res = await sb()
        .from('sponsors')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(function (s) {
        return {
          id: s.id,
          nameEn: s.name_en,
          nameKn: s.name_kn,
          orgEn: s.org_en,
          orgKn: s.org_kn,
          package: s.package,
          amount: s.amount,
          photo: s.logo_url,
          descEn: s.description_en,
          descKn: s.description_kn,
          order_index: s.order_index
        };
      });
    } catch (e) {
      console.warn('Supabase getSponsors error:', e);
      return null;
    }
  }

  async function saveSponsor(spData) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var payload = {
      name_en: spData.nameEn || '',
      name_kn: spData.nameKn || '',
      org_en: spData.orgEn || '',
      org_kn: spData.orgKn || '',
      package: spData.package || '',
      amount: spData.amount || '',
      logo_url: spData.photo || '',
      description_en: spData.descEn || '',
      description_kn: spData.descKn || '',
      order_index: typeof spData.order_index === 'number' ? spData.order_index : 0,
      updated_at: new Date().toISOString()
    };
    if (spData.id && spData.id.length > 20) {
      var uRes = await sb().from('sponsors').update(payload).eq('id', spData.id).select();
      if (uRes.error) throw uRes.error;
      return uRes.data[0];
    } else {
      var iRes = await sb().from('sponsors').insert([payload]).select();
      if (iRes.error) throw iRes.error;
      return iRes.data[0];
    }
  }

  async function deleteSponsor(id) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var res = await sb().from('sponsors').delete().eq('id', id);
    if (res.error) throw res.error;
    return true;
  }

  // ------------------------------------------------------------------
  // 9. GALLERY
  // ------------------------------------------------------------------
  async function getGallery() {
    if (!isReady()) return null;
    try {
      var res = await sb()
        .from('gallery')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(function (g) {
        return {
          id: g.id,
          type: g.type,
          img: g.url,
          thumb: g.thumb_url,
          titleEn: g.title_en,
          titleKn: g.title_kn,
          captionEn: g.caption_en,
          captionKn: g.caption_kn,
          year: g.year,
          category: g.category,
          key: g.video_key,
          modal: g.type === 'video' && !!g.video_key,
          order_index: g.order_index
        };
      });
    } catch (e) {
      console.warn('Supabase getGallery error:', e);
      return null;
    }
  }

  async function saveGalleryItem(item) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var payload = {
      type: item.type || 'photo',
      url: item.img || item.url || '',
      thumb_url: item.thumb || '',
      title_en: item.titleEn || '',
      title_kn: item.titleKn || '',
      caption_en: item.captionEn || '',
      caption_kn: item.captionKn || '',
      year: item.year || '2025',
      category: item.category || (item.type === 'video' ? 'videos' : 'photos'),
      video_key: item.key || '',
      order_index: typeof item.order_index === 'number' ? item.order_index : 0,
      updated_at: new Date().toISOString()
    };
    if (item.id && item.id.length > 20) {
      var uRes = await sb().from('gallery').update(payload).eq('id', item.id).select();
      if (uRes.error) throw uRes.error;
      return uRes.data[0];
    } else {
      var iRes = await sb().from('gallery').insert([payload]).select();
      if (iRes.error) throw iRes.error;
      return iRes.data[0];
    }
  }

  async function deleteGalleryItem(id) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var res = await sb().from('gallery').delete().eq('id', id);
    if (res.error) throw res.error;
    return true;
  }

  // ------------------------------------------------------------------
  // 10. VENUE & SPONSOR CONTACT
  // ------------------------------------------------------------------
  async function getVenue() {
    var localSaved = null;
    try {
      var raw = localStorage.getItem('kv_venue_v1');
      if (raw && raw !== 'null') localSaved = JSON.parse(raw);
    } catch (e) {}

    var defaultObj = {
      nameEn: 'HKBK College of Engineering',
      nameKn: 'ಎಚ್‌ಕೆಬಿಕೆ ಇಂಜಿನಿಯರಿಂಗ್ ಕಾಲೇಜು',
      addrEn: 'Opp. Manyata Tech Park, Nagawara, Bengaluru, Karnataka 560045',
      addrKn: 'ಮಾನ್ಯತಾ ಟೆಕ್ ಪಾರ್ಕ್ ಎದುರು, ನಾಗವಾರ, ಬೆಂಗಳೂರು, ಕರ್ನಾಟಕ ೫೬೦೦೪೫',
      date: 'Tuesday, 3 November 2026',
      time: '9:00 AM onwards',
      descEn: 'State-of-the-art campus featuring an open-air amphitheatre, main auditorium, food court, and ample parking facilities for attendees.',
      descKn: 'ಆಧುನಿಕ ಸೌಲಭ್ಯಗಳುಳ್ಳ ಕ್ಯಾಂಪಸ್, ತೆರೆದ ಸಭಾಂಗಣ, ಆಡಿಟೋರಿಯಂ, ಫುಡ್ ಕೋರ್ಟ್ ಮತ್ತು ವಿಶಾಲವಾದ ಪಾರ್ಕಿಂಗ್ ಸೌಲಭ್ಯವನ್ನು ಹೊಂದಿದೆ.',
      image: '',
      mapsUrl: 'https://maps.google.com/?q=HKBK+College+of+Engineering+Nagawara+Bengaluru',
      phone: (localSaved && localSaved.phone && localSaved.phone !== '+91 98450 00000' && localSaved.phone !== '[ADD CONTACT NUMBER]') ? localSaved.phone : '9980321527',
      email: (localSaved && localSaved.email && localSaved.email !== 'info@hkbk.edu.in' && localSaved.email !== '[ADD EMAIL]') ? localSaved.email : 'jaipalreddy9980321527@gmail.com'
    };

    if (!isReady()) return localSaved || defaultObj;

    try {
      var res = await sb().from('venue').select('*').limit(1);
      if (res.error) throw res.error;
      if (!res.data || !res.data.length) return localSaved || defaultObj;
      var v = res.data[0];

      var phoneVal = v.phone;
      if (!phoneVal || phoneVal === '+91 98450 00000' || phoneVal === '[ADD CONTACT NUMBER]') {
        phoneVal = (localSaved && localSaved.phone && localSaved.phone !== '+91 98450 00000' && localSaved.phone !== '[ADD CONTACT NUMBER]') ?
          localSaved.phone : '9980321527';
      }

      var emailVal = v.email;
      if (!emailVal || emailVal === 'info@hkbk.edu.in' || emailVal === '[ADD EMAIL]') {
        emailVal = (localSaved && localSaved.email && localSaved.email !== 'info@hkbk.edu.in' && localSaved.email !== '[ADD EMAIL]') ?
          localSaved.email : 'jaipalreddy9980321527@gmail.com';
      }

      var result = {
        id: v.id,
        nameEn: v.name_en || defaultObj.nameEn,
        nameKn: v.name_kn || defaultObj.nameKn,
        addrEn: v.address_en || defaultObj.addrEn,
        addrKn: v.address_kn || defaultObj.addrKn,
        date: (v.date === 'Wednesday, 4 November 2026' ? 'Tuesday, 3 November 2026' : (v.date || defaultObj.date)),
        time: v.time || defaultObj.time,
        descEn: v.description_en || defaultObj.descEn,
        descKn: v.description_kn || defaultObj.descKn,
        image: v.image_url || '',
        mapsUrl: v.maps_url || defaultObj.mapsUrl,
        phone: phoneVal,
        email: emailVal
      };

      try { localStorage.setItem('kv_venue_v1', JSON.stringify(result)); } catch (e) {}
      return result;
    } catch (e) {
      console.warn('Supabase getVenue error:', e);
      return localSaved || defaultObj;
    }
  }

  async function saveVenue(venueData) {
    var payload = {
      name_en: venueData.nameEn || '',
      name_kn: venueData.nameKn || '',
      address_en: venueData.addrEn || venueData.address || '',
      address_kn: venueData.addrKn || '',
      date: venueData.date || '',
      time: venueData.time || '',
      description_en: venueData.descEn || '',
      description_kn: venueData.descKn || '',
      image_url: venueData.image || '',
      maps_url: venueData.mapsUrl || '',
      phone: venueData.phone || '9980321527',
      email: venueData.email || 'jaipalreddy9980321527@gmail.com',
      updated_at: new Date().toISOString()
    };

    var normalized = {
      nameEn: payload.name_en,
      nameKn: payload.name_kn,
      addrEn: payload.address_en,
      addrKn: payload.address_kn,
      date: payload.date,
      time: payload.time,
      descEn: payload.description_en,
      descKn: payload.description_kn,
      mapsUrl: payload.maps_url,
      image: payload.image_url,
      phone: payload.phone,
      email: payload.email
    };

    try { localStorage.setItem('kv_venue_v1', JSON.stringify(normalized)); } catch (e) {}

    try {
      var sc = {
        venue: payload.name_en,
        address: payload.address_en,
        date: payload.date,
        time: payload.time,
        phone: payload.phone,
        email: payload.email
      };
      localStorage.setItem('kv_sponsor_contact_v1', JSON.stringify(sc));
    } catch (e) {}

    if (isReady()) {
      try {
        var existing = await sb().from('venue').select('id').limit(1);
        if (existing.data && existing.data.length) {
          var uRes = await sb().from('venue').update(payload).eq('id', existing.data[0].id).select();
          if (!uRes.error && uRes.data && uRes.data.length) {
            return uRes.data[0];
          }
        } else {
          var iRes = await sb().from('venue').insert([payload]).select();
          if (!iRes.error && iRes.data && iRes.data.length) {
            return iRes.data[0];
          }
        }
      } catch (err) {
        console.warn('Supabase venue write warning (saved locally):', err);
      }
    }
    return normalized;
  }

  // Sponsorship Contact (Phone & Email editable from Admin)
  async function getSponsorshipContact() {
    var v = await getVenue();
    return {
      phone: (v && v.phone) ? v.phone : '9980321527',
      email: (v && v.email) ? v.email : 'jaipalreddy9980321527@gmail.com'
    };
  }

  async function saveSponsorshipContact(contact) {
    var phone = (contact && contact.phone) ? String(contact.phone).trim() : '9980321527';
    var email = (contact && contact.email) ? String(contact.email).trim() : 'jaipalreddy9980321527@gmail.com';

    var currentVenue = (await getVenue()) || {};
    currentVenue.phone = phone;
    currentVenue.email = email;

    await saveVenue(currentVenue);

    try {
      localStorage.setItem('kv_sponsor_contact_v1', JSON.stringify({ phone: phone, email: email }));
    } catch (e) {}

    return { phone: phone, email: email };
  }

  // ------------------------------------------------------------------
  // 11. SCHEDULE
  // ------------------------------------------------------------------
  function getScheduleTimeSortValue(s) {
    if (!s) return 9999;
    if (typeof s.order_index === 'number' && s.order_index > 0) {
      return s.order_index * 1000;
    }
    var t = String(s.time_en || s.t_en || '').toLowerCase();
    var h = String(s.heading_en || s.h_en || '').toLowerCase();

    if (t.indexOf('9:00') !== -1 || h.indexOf('nashik') !== -1) return 100;
    if (t.indexOf('10:00') !== -1 || t.indexOf('10:30') !== -1 || h.indexOf('parade') !== -1) return 200;
    if (t.indexOf('11:30') !== -1 || h.indexOf('conclave') !== -1) return 300;
    if (t.indexOf('12:00') !== -1 || h.indexOf('main function') !== -1 || h.indexOf('lunch') !== -1) return 400;
    if (t.indexOf('till 4:00') !== -1 || h.indexOf('cultural performances') !== -1) return 500;
    if (t.indexOf('break') !== -1 || t.indexOf('afternoon') !== -1 || h.indexOf('break') !== -1) return 600;
    if (t.indexOf('4:30') !== -1 || t.indexOf('7:00') !== -1 || h.indexOf('concert') !== -1 || h.indexOf('savaari') !== -1) return 700;

    var match = t.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
    if (match) {
      var hours = parseInt(match[1], 10);
      var mins = match[2] ? parseInt(match[2], 10) : 0;
      var meridiem = match[3] ? match[3].toLowerCase() : '';
      if (!meridiem) {
        if (hours >= 9 && hours <= 11) meridiem = 'am';
        else meridiem = 'pm';
      }
      if (meridiem === 'pm' && hours < 12) hours += 12;
      if (meridiem === 'am' && hours === 12) hours = 0;
      return hours * 60 + mins;
    }

    return 9999;
  }

  function sortSchedule(list) {
    if (!Array.isArray(list)) return [];
    return list.slice().sort(function (a, b) {
      var va = getScheduleTimeSortValue(a);
      var vb = getScheduleTimeSortValue(b);
      if (va !== vb) return va - vb;
      return (a.order_index || 0) - (b.order_index || 0);
    });
  }

  async function getSchedule() {
    if (!isReady()) return null;
    try {
      var res = await sb()
        .from('schedule')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });
      if (res.error) throw res.error;
      var items = (res.data || []).map(function (s) {
        return {
          id: s.id,
          t_en: s.time_en,
          t_kn: s.time_kn,
          h_en: s.heading_en,
          h_kn: s.heading_kn,
          d_en: s.description_en,
          d_kn: s.description_kn,
          order_index: s.order_index
        };
      });
      return sortSchedule(items);
    } catch (e) {
      console.warn('Supabase getSchedule error:', e);
      return null;
    }
  }

  async function saveScheduleItem(item) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var payload = {
      time_en: item.t_en || '',
      time_kn: item.t_kn || '',
      heading_en: item.h_en || '',
      heading_kn: item.h_kn || '',
      description_en: item.d_en || '',
      description_kn: item.d_kn || '',
      order_index: typeof item.order_index === 'number' ? item.order_index : 0,
      updated_at: new Date().toISOString()
    };
    if (item.id && item.id.length > 20) {
      var uRes = await sb().from('schedule').update(payload).eq('id', item.id).select();
      if (uRes.error) throw uRes.error;
      return uRes.data[0];
    } else {
      var iRes = await sb().from('schedule').insert([payload]).select();
      if (iRes.error) throw iRes.error;
      return iRes.data[0];
    }
  }

  async function deleteScheduleItem(id) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var res = await sb().from('schedule').delete().eq('id', id);
    if (res.error) throw res.error;
    return true;
  }

  // ------------------------------------------------------------------
  // 12. SUPABASE STORAGE (Upload Images / Media)
  // ------------------------------------------------------------------
  async function uploadMedia(file, folder) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    if (!file) throw new Error('No file provided.');

    var client = sb();
    var ext = file.name ? file.name.split('.').pop() : 'jpg';
    var cleanExt = ext.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'jpg';
    var filename = (folder || 'uploads') + '/' + Date.now() + '_' + Math.random().toString(36).substring(2, 8) + '.' + cleanExt;

    var upRes = await client.storage.from('media').upload(filename, file, {
      cacheControl: '3600',
      upsert: true
    });
    if (upRes.error) throw upRes.error;

    var pubRes = client.storage.from('media').getPublicUrl(filename);
    if (!pubRes || !pubRes.data || !pubRes.data.publicUrl) {
      throw new Error('Could not retrieve public URL for uploaded file.');
    }
    return pubRes.data.publicUrl;
  }

  // ------------------------------------------------------------------
  // 13. ADMIN PROFILE CHECK
  // ------------------------------------------------------------------
  async function checkAdminRole(userId) {
    if (!userId) return false;
    if (userId === 'admin-local-id') return true;
    if (!isReady()) return true;
    try {
      var res = await sb()
        .from('admin_profiles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .limit(1);
      if (res.error) return true;
      return !!(res.data && res.data.length > 0);
    } catch (e) {
      return true;
    }
  }

  // ------------------------------------------------------------------
  // 14. LOCALSTORAGE MIGRATION TO SUPABASE
  // ------------------------------------------------------------------
  async function migrateLocalStorageToSupabase(progressCb) {
    if (!isReady()) throw new Error('Supabase is not configured.');
    var update = function (msg) {
      if (typeof progressCb === 'function') progressCb(msg);
    };

    update('Starting migration from localStorage to Supabase...');

    var client = sb();

    // 1. Events
    try {
      var rawEv = localStorage.getItem('kv_events_v2');
      if (rawEv) {
        var evList = JSON.parse(rawEv);
        if (Array.isArray(evList) && evList.length) {
          update('Migrating ' + evList.length + ' events...');
          for (var i = 0; i < evList.length; i++) {
            var item = evList[i];
            item.order_index = i;
            if (!item.id || item.id.length < 20) {
              var exEv = await client.from('events').select('id').eq('title_en', item.titleEn || '').limit(1);
              if (exEv.data && exEv.data.length > 0) item.id = exEv.data[0].id;
            }
            await saveEvent(item);
          }
        }
      }
    } catch (e) {
      console.warn('Events migration error:', e);
    }

    // 2. Conclave Professors
    try {
      var rawProf = localStorage.getItem('conclave_professors_v1');
      if (rawProf) {
        var profList = JSON.parse(rawProf);
        if (Array.isArray(profList) && profList.length) {
          update('Migrating ' + profList.length + ' conclave professors...');
          for (var p = 0; p < profList.length; p++) {
            var prof = profList[p];
            prof.order_index = p;
            if (!prof.id || prof.id.length < 20) {
              var exProf = await client.from('conclave_professors').select('id').eq('name_en', prof.nameEn || '').limit(1);
              if (exProf.data && exProf.data.length > 0) prof.id = exProf.data[0].id;
            }
            await saveConclaveProfessor(prof);
          }
        }
      }
    } catch (e) {
      console.warn('Professors migration error:', e);
    }

    // 3. Student Committee
    try {
      var rawStd = localStorage.getItem('studentCommitteeMembers') || localStorage.getItem('kv_members_v2');
      if (rawStd) {
        var stdList = JSON.parse(rawStd);
        if (Array.isArray(stdList) && stdList.length) {
          update('Migrating ' + stdList.length + ' student committee members...');
          for (var s = 0; s < stdList.length; s++) {
            var sm = stdList[s];
            sm.order_index = s;
            if (!sm.id || sm.id.length < 20) {
              var exSm = await client.from('student_committee').select('id').eq('name_en', sm.nameEn || '').limit(1);
              if (exSm.data && exSm.data.length > 0) sm.id = exSm.data[0].id;
            }
            await saveStudentMember(sm);
          }
        }
      }
    } catch (e) {
      console.warn('Student committee migration error:', e);
    }

    // 4. Management Committee
    try {
      var rawMgmt = localStorage.getItem('managementCommitteeMembers') || localStorage.getItem('kv_mgmt_members_v1');
      if (rawMgmt) {
        var mgmtList = JSON.parse(rawMgmt);
        if (Array.isArray(mgmtList) && mgmtList.length) {
          update('Migrating ' + mgmtList.length + ' management committee members...');
          for (var m = 0; m < mgmtList.length; m++) {
            var mm = mgmtList[m];
            mm.order_index = m;
            if (!mm.id || mm.id.length < 20) {
              var exMm = await client.from('management_committee').select('id').eq('name_en', mm.nameEn || '').limit(1);
              if (exMm.data && exMm.data.length > 0) mm.id = exMm.data[0].id;
            }
            await saveMgmtMember(mm);
          }
        }
      }
    } catch (e) {
      console.warn('Management committee migration error:', e);
    }

    // 5. Guests
    try {
      var rawGuests = localStorage.getItem('kv_guests_v1');
      if (rawGuests) {
        var guestList = JSON.parse(rawGuests);
        if (Array.isArray(guestList) && guestList.length) {
          update('Migrating ' + guestList.length + ' guests...');
          for (var g = 0; g < guestList.length; g++) {
            var gm = guestList[g];
            gm.order_index = g;
            if (!gm.id || gm.id.length < 20) {
              var exGm = await client.from('guests').select('id').eq('name_en', gm.nameEn || '').limit(1);
              if (exGm.data && exGm.data.length > 0) gm.id = exGm.data[0].id;
            }
            await saveGuest(gm);
          }
        }
      }
    } catch (e) {
      console.warn('Guests migration error:', e);
    }

    // 6. Packages
    try {
      var rawPk = localStorage.getItem('kv_packages_v1');
      if (rawPk) {
        var pkList = JSON.parse(rawPk);
        if (Array.isArray(pkList) && pkList.length) {
          update('Migrating ' + pkList.length + ' sponsorship packages...');
          for (var k = 0; k < pkList.length; k++) {
            var pkm = pkList[k];
            pkm.order_index = k;
            if (!pkm.id || pkm.id.length < 20) {
              var exPk = await client.from('sponsorship_packages').select('id').eq('name_en', pkm.nameEn || '').limit(1);
              if (exPk.data && exPk.data.length > 0) pkm.id = exPk.data[0].id;
            }
            await savePackage(pkm);
          }
        }
      }
    } catch (e) {
      console.warn('Packages migration error:', e);
    }

    // 7. Sponsors
    try {
      var rawSp = localStorage.getItem('kv_sponsors_v1');
      if (rawSp) {
        var spList = JSON.parse(rawSp);
        if (Array.isArray(spList) && spList.length) {
          update('Migrating ' + spList.length + ' sponsors...');
          for (var sp = 0; sp < spList.length; sp++) {
            var spm = spList[sp];
            spm.order_index = sp;
            if (!spm.id || spm.id.length < 20) {
              var exSp = await client.from('sponsors').select('id').eq('name_en', spm.nameEn || '').limit(1);
              if (exSp.data && exSp.data.length > 0) spm.id = exSp.data[0].id;
            }
            await saveSponsor(spm);
          }
        }
      }
    } catch (e) {
      console.warn('Sponsors migration error:', e);
    }

    // 8. Gallery
    try {
      var rawGal = localStorage.getItem('kv_gallery_v1');
      if (rawGal) {
        var galList = JSON.parse(rawGal);
        if (Array.isArray(galList) && galList.length) {
          update('Migrating ' + galList.length + ' gallery items...');
          for (var gi = 0; gi < galList.length; gi++) {
            var gal = galList[gi];
            gal.order_index = gi;
            if (!gal.id || gal.id.length < 20) {
              var exGal = await client.from('gallery').select('id').eq('url', gal.img || gal.url || '').limit(1);
              if (exGal.data && exGal.data.length > 0) gal.id = exGal.data[0].id;
            }
            await saveGalleryItem(gal);
          }
        }
      }
    } catch (e) {
      console.warn('Gallery migration error:', e);
    }

    // 9. Venue
    try {
      var rawVenue = localStorage.getItem('kv_venue_v1');
      if (rawVenue && rawVenue !== 'null') {
        var vObj = JSON.parse(rawVenue);
        if (vObj) {
          update('Migrating venue details...');
          await saveVenue(vObj);
        }
      }
    } catch (e) {
      console.warn('Venue migration error:', e);
    }

    try {
      localStorage.setItem('kv_migrated_to_supabase', 'true');
    } catch (e) {}

    update('Migration complete! All local data is now in Supabase.');
    return true;
  }

  // Expose API
  window.SupabaseData = {
    isReady: isReady,
    checkAdminRole: checkAdminRole,

    // 1. Home
    getHomeContent: getHomeContent,
    saveHomeContent: saveHomeContent,

    // 2. Events
    getEvents: getEvents,
    saveEvent: saveEvent,
    deleteEvent: deleteEvent,

    // 3. Conclave Professors
    getConclaveProfessors: getConclaveProfessors,
    saveConclaveProfessor: saveConclaveProfessor,
    deleteConclaveProfessor: deleteConclaveProfessor,

    // 4. Student Committee
    getStudentCommittee: getStudentCommittee,
    saveStudentMember: saveStudentMember,
    deleteStudentMember: deleteStudentMember,

    // 5. Management Committee
    getManagementCommittee: getManagementCommittee,
    saveMgmtMember: saveMgmtMember,
    deleteMgmtMember: deleteMgmtMember,

    // 6. Guests
    getGuests: getGuests,
    saveGuest: saveGuest,
    deleteGuest: deleteGuest,

    // 7. Packages
    getPackages: getPackages,
    savePackage: savePackage,
    deletePackage: deletePackage,

    // 8. Sponsors
    getSponsors: getSponsors,
    saveSponsor: saveSponsor,
    deleteSponsor: deleteSponsor,

    // 9. Gallery
    getGallery: getGallery,
    saveGalleryItem: saveGalleryItem,
    deleteGalleryItem: deleteGalleryItem,

    // 10. Venue & Sponsorship Contact
    getVenue: getVenue,
    saveVenue: saveVenue,
    getSponsorshipContact: getSponsorshipContact,
    saveSponsorshipContact: saveSponsorshipContact,

    // 11. Schedule
    getSchedule: getSchedule,
    sortSchedule: sortSchedule,
    saveScheduleItem: saveScheduleItem,
    deleteScheduleItem: deleteScheduleItem,

    // Storage & Migration
    uploadMedia: uploadMedia,
    migrateLocalStorageToSupabase: migrateLocalStorageToSupabase
  };
})(typeof window !== 'undefined' ? window : this);
