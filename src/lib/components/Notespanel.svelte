
<script>
	import { fade, fly } from 'svelte/transition';
	import ElapsedClock from './ElapsedClock.svelte';

        let { existing_notes = [], machine = 'error' } = $props();
	let notes = $derived(existing_notes);

	let urgentNotes = $derived(() => notes.filter(note => note.status === 'urgent'));
	let solvedNotes = $derived(() => notes.filter(note => note.status === 'solved'));
	let recurringNotes = $derived(() => notes.filter(note => note.status === 'recurring'));

	let state = $state({ expanded: false, active: 0 });
	let menuOpen = $state(false);
        let typing = $state({ currently: false });
	let menuFocused = $state('');
	let message = $state('');
	let container;

	let isScrolling = $state(false);
	let simpleDebounce = $state(0);
        const paneChange = () => {
	        simpleDebounce += simpleDebounce;	
		const debounce = simpleDebounce;
		isScrolling = true;
		setTimeout(() => {
			if (debounce === simpleDebounce) {
				isScrolling = false;
                        }
		}, 4000); 
	}
	const handleScroll = () => {
	        simpleDebounce += simpleDebounce;	
		const debounce = simpleDebounce;
		isScrolling = true;
		setTimeout(() => {
			if (debounce === simpleDebounce) {
				isScrolling = false;
                        }
		}, 900); 
	};
        const toggleMenu = () => {
		menuOpen = !menuOpen;
        }
	const toggle = () => {
		state.expanded = !state.expanded;
	};
	const activePane = (num) => {
		if (num < 4) {
			state.active = num;
			paneChange();
		}
	};
	function handleFocus() {
		typing.currently = true;
	}

	function handleBlur() {
		typing.currently = false;
	}
        function scrollDown() {
		container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
	}
        function scrollUp() {
		container.scrollTo({ top: 0, behavior: 'smooth' })
	}
        async function deleteNote(id) {
                if (id.length === 0) { return; }
                const result = await fetch('/api/admin-delete-note', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id })
                });
                if (result.ok) {
			console.log("deleting note ", id);
			notes = notes.filter(note => note.id !== id);
                } else {
                        console.log("failed to delete");
		}
        }
        async function sendMessage() {
		if (message.length === 0) { return; }
		console.log('message: ', message);
		// Update server state
		const result = await fetch('/api/create-note', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: message, engineer: machine })
		});
		console.log("created: ", { text: message, engineer: machine });
	        if (result.ok) {
			const json = await result.json();
			const newNote = json.body[0];
			message = ''; 
		        notes = [
		        	{
		        		id: newNote.id,
		        		engineer: newNote.engineer,
		        		created: newNote.created,
		        		text: newNote.text,
		        		status: newNote.status,
		        		madeCritical: null,
		        		madeRecurring: null,
		        		madeSolved: null
		        	},
		        	...notes
		        ];
			activePane(0);
			scrollUp();
	        }

        }
        async function markSolved(id) {
		// Update server state
		const result = await fetch('/api/mark-solved', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
	        if (result.ok) {
	        	// Update the local state
	        	notes = notes.map(note =>
	        		note.id === id ? { ...note, status: 'solved' } : note
	        	);
	        }

        }
        async function markUrgent(id) {
		// Update server state
		const result = await fetch('/api/mark-urgent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
	        if (result.ok) {
	        	// Update the local state
	        	notes = notes.map(note =>
	        		note.id === id ? { ...note, status: 'urgent' } : note
	        	);
	        }
        }
        async function markRecurring(id) {
		// Update server state
		const result = await fetch('/api/mark-recurring', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id })
		});
	        if (result.ok) {
	        	// Update the local state
	        	notes = notes.map(note =>
	        		note.id === id ? { ...note, status: 'recurring' } : note
	        	);
	        }
        }


        function exitNote(id) {
		console.log(menuFocused, id, menuFocused === id);
		menuFocused = (menuFocused === id) ? '' : id;
        }
	const inputPanelClass = $derived(() => {
		return [
			'inputPanel', // base class
			typing.currently ? 'grow' : '',
			state.expanded ? 'expanded' : ''
		].filter(Boolean).join(' ');
	});
	const tabClass = $derived(() => {
		return [
			'tab', 
			state.expanded ? 'expanded' : 'halo'
		].filter(Boolean).join(' ');
	});
	const menuElement = $derived((x) => {
		return [
			'item',
			state.expanded ? 'expanded' : '',
			state.active === x ? 'glow' : 'noglow'
		].filter(Boolean).join(' ');
	});
	const pane1Class = $derived(() => {
		return [
			'pane', 
			state.active === 1 ? 'active' : 'inactive',
		].filter(Boolean).join(' ');
	});
	const pane2Class = $derived(() => {
		return [
			'pane', 
			state.active === 2 ? 'active' : 'inactive'
		].filter(Boolean).join(' ');
	});
	const pane3Class = $derived(() => {
		return [
			'pane',
			state.active === 3 ? 'active' : 'inactive'
		].filter(Boolean).join(' ');
	});
	const pane4Class = $derived(() => {
		return [
			'pane', 
			state.active === 0 ? 'active' : 'inactive'
		].filter(Boolean).join(' ');
	});
        const noteClass = $derived(() => {
		return [
			'note', 
		].filter(Boolean).join(' ');
        });
        const sendButtonClass = $derived(() => {
		return [
			'sendButton', 
		].filter(Boolean).join(' ');
        });
</script>

<style>
  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: auto;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .tab {
    position: fixed;
    top: 1rem;
    left: 0;
    display: flex;
    width: 4rem;
    height: 4rem;
    background-color: rgba(30, 30, 30, 0.1);
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    pointer-events: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2em;
    user-select: none;
    z-index: 1001;
  }
  .tab.expanded {
  }
  .halo {
	border-right: solid white 2px;
	border-bottom: solid white 2px;
  }
  .menu {
    position: fixed;
    top: 5rem;
    left: 0;
    height: 10;
    width: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;
    z-index: 1001;
    background-color: rgba(1,1,1,0);
  }
  .menu.expanded {
    width: 4rem;
  }

  .item {
    aspect-ratio: 1;
    width: 2rem;
    height: auto;
    border-radius: 50%;
    background-color: rgba(30, 30, 30, 1);
    border: solid transparent 2px;
    color: white;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    cursor: pointer;
    outline: none;
    margin-left: 2rem;
    user-select: none;
    opacity: 0;
    transition: all 0.3s ease;
  }
  .item.expanded {
    opacity: 1;
    display: flex;
  }
  .glow {
    border-radius: 25%;
  }
  .noglow {
    border-radius: 50%;
  }

  .panel {
    height: 100vh;
    width: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    transition: width 0.4s ease;
    overflow: hidden;
    pointer-events: auto;
    z-index: 1000;
  }

  .panel.expanded {
    width: 100vw;
  }
  .paneWrapper {
    width: 100vw;
    height: auto;
    flex: 1;
    overflow-y: auto;
    display: block;
  }
  .pane {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background-color: rgba(50, 50, 50, 1);
  }
  .pane.inactive {
    width: 0;
    height: 0;
    opacity: 0;
    margin: 0;
    padding: 0;
  }
  .pane.inactive > * {
    display: none;
  }
  .pane.active {
    width: 100%;
    height: 100% !important;
    flex: 1;
    padding: 20px;
    box-sizing: border-box; 
    overflow-y: auto;
  }
  .borderRed {
    border: solid rgba(242, 27, 63, 1) 2px;
  }
  .borderGreen {
    border: solid rgba(41, 191, 18, 1) 2px;
  }
  .borderPurple {
    border: solid rgba(8, 189, 189, 1) 2px;
  }
  .grey {
    background-color: rgba(30, 30, 30, 1);
  }
  .red {
    background: linear-gradient(90deg,rgba(242, 27, 63, 1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0) 100%);
    transition: background-color 0.5s ease-in-out;
  }
  .purple {
    background: linear-gradient(90deg,rgba(8, 189, 189, 1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0) 100%);
    transition: background-color 0.5s ease-in-out;
  }
  .green {
    background: linear-gradient(90deg,rgba(41, 191, 18, 1) 0%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0) 100%);
    transition: background-color 0.5s ease-in-out;
  }
  .note {
    position: relative;
    flex-shrink: 0;
    height: 15rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-family: 'Manrope', sans-serif;
    margin-bottom: 0.4rem;
    border-radius: 8px;
    box-sizing: border-box; 
    padding: 6px;
    background-color: rgba(205, 215, 205, 1);
  }
  .noteExitButton { 
    height: 1.3rem;
    width: 1.3rem;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: rgba(50,50,50,1);
  }
  .noteGreenButton { 
    height: 1.3rem;
    width: 1.3rem;
    flex-shrink: 0;
    border-radius: 50%;
    background-color:rgba(41, 191, 18, 1);
  }
  .noteRedButton { 
    height: 1.3rem;
    width: 1.3rem;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: rgba(242, 27, 63, 1);
  }
  .notePurpleButton { 
    height: 1.3rem;
    width: 1.3rem;
    flex-shrink: 0;
    border-radius: 50%;
    background-color: rgba(8, 189, 189, 1);
  }
  .noteMenu {
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-around;
    height: 100%;
    width: 1rem;
    overflow: hidden;
    border-radius: 6px;
    transition: all 0.5s ease !important;
  }
  .menuFocused {
    width: 12rem;
    transition: all 0.5s ease !important;
  }
  .noteHeader {
    display: flex;
    height: 2rem;
    width: 100%;
    justify-content: flex-end;
    border-radius: 6px;
    margin: 0;
    padding: 0;
    transition: background-color 2.5s ease;
  }
  .noteContent {
    flex: 1
    width: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    font-size: 22px;
    overflow: auto;
  }
  .noteFooter {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 2rem;
    width: 100%;
  }

  .inputPanel {
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100vw;
    height: 0;
    transition: all 0.4s ease;
    background-color: transparent;
    box-sizing: border-box; 
    border-radius: 12px 12px 0 0;   
    background-color: rgba(63,63,63,1);
    overflow: hidden;
  }
  .inputPanel.expanded {
    min-height: 25vh;
    height: auto;
  }
  textarea {
    all: unset;           /* Remove all default styles */
    display: none;
    font-size: 22px;
    box-sizing: border-box; 
    border-radius: 12px;   
    padding: 0.5rem;      
    font-family: inherit; 
    margin-right: 4px;
    color: rgba(255,255,255,1);
    background-color: rgba(205, 215, 205, 1);
  }
  .expanded textarea {
    display: block;
    width: 80%;
  }
  .grow {
  }
  .grow textarea {
    /* height: 40vh; */
  }
  .menuButton {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    width: 2rem;
    height: auto;
    border-radius: 50%;
    background-color: rgba(0,0,0,1); 
    margin-left: 4px;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    border: solid transparent 2px;
    outline: none;
    user-select: none;
    transition: width 0.3s ease;
  }
  .sendButton {
    aspect-ratio: 1;
    width: 3rem;
    height: auto;
    border-radius: 50%;
    background-color: rgba(37,211,102,1); /* Bootstrap blue */
    margin-left: auto;
    color: white;
    font-size: 1rem;
    cursor: pointer;
    border: none;
    outline: none;
    user-select: none;
    transition: width 0.3s ease;
  }
  .row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    box-sizing: border-box;
    border-radius: 12px;
    padding: 6px;
  }

/* 4K Monitor */
@media (min-height: 2160px) {
  .pane.active,
  .paneWrapper {
    height: 1728px; /* 80% of 2160px */
  }
}

/* WQHD (1440px height) */
@media (min-height: 1440px) and (max-height: 2159px) {
  .pane.active,
  .paneWrapper {
    height: 1152px;
  }
}

/* Full HD (1080px height) */
@media (min-height: 1080px) and (max-height: 1439px) {
  .pane.active,
  .paneWrapper {
    height: 864px;
  }
}

/* WXGA+ (900px height) */
@media (min-height: 900px) and (max-height: 1079px) {
  .pane.active,
  .paneWrapper {
    height: 720px;
  }
}

/* HD+ (768px height) */
@media (min-height: 768px) and (max-height: 899px) {
  .pane.active,
  .paneWrapper {
    height: 614px;
  }
}

/* WXGA (800px height) */
@media (min-height: 800px) and (max-height: 767px) {
  .pane.active,
  .paneWrapper {
    height: 640px;
  }
}

/* iPad Pro (1366px height) */
@media (min-height: 1024px) and (max-height: 799px) {
  .pane.active,
  .paneWrapper {
    height: 1092px;
  }
}

/* Tablet (1024px height) */
@media (min-height: 768px) and (max-height: 1023px) {
  .pane.active,
  .paneWrapper {
    height: 819px;
  }
}

/* Mobile Large (570px height) */
@media (min-height: 570px) and (max-height: 767px) {
  .pane.active,
  .paneWrapper {
    height: 570px;
  }
}

/* Mobile Small (456px height) */
@media (max-height: 569px) {
  .pane.active,
  .paneWrapper {
    height: 456px;
  }
}


</style>

<div class={tabClass()} onclick={toggle} class:grey={!state.expanded || isScrolling || typing.currently}>
  {state.expanded ? '‹' : '›'}
</div>
<div class="wrapper" >
  <div class="panel {state.expanded ? 'expanded' : ''}">
    <div class="paneWrapper">
      <div class={pane4Class()} bind:this={container} onscroll={handleScroll}>
        {#each notes as note (note.id)}
          <div 
		class={noteClass()} 
		transition:fly={{ x: 200, duration: 500 }}
	  >
	    <div class="noteHeader"
		class:red={note.status === "urgent"}
		class:purple={note.status === "recurring"}
		class:green={note.status === "solved"}
            >
              <div class="noteMenu" class:menuFocused={note.id === menuFocused}>
                <div class="noteRedButton" onclick={() => markUrgent(note.id)}></div>
                <div class="notePurpleButton" onclick={() => markRecurring(note.id)}></div>
                <div class="noteExitButton" onclick={() => exitNote(note.id)}></div>
              </div>
	    </div>
	    <div class="noteContent">
              {note.text}
	    </div>
	    <div class="noteFooter">
              {#if note.engineer}
                <span>{note.engineer}</span>
		<span>{note.created}</span>
		<span><ElapsedClock timestamp={note.created} /></span>
              {/if}
	    </div>
          </div>
        {/each}

      </div>
      <div class={pane1Class()} onscroll={handleScroll}>
        {#each urgentNotes() as note (note.id)}
          <div 
		class={noteClass()} 
		transition:fly={{ x: 200, duration: 500 }}
	  >
	    <div class="noteHeader"
		class:red={note.status === "urgent"}
		class:purple={note.status === "recurring"}
		class:green={note.status === "solved"}
            >
              <div class="noteMenu" class:menuFocused={note.id === menuFocused}>
                <div class="noteGreenButton" onclick={() => markSolved(note.id)}></div>
                <div class="notePurpleButton" onclick={() => markRecurring(note.id)}></div>
                <div class="noteExitButton" onclick={() => exitNote(note.id)}></div>
              </div>
	    </div>
	    <div class="noteContent">
              {note.text}
	    </div>
	    <div class="noteFooter">
              {#if note.engineer}
                <span>{note.engineer}</span>
		<span>{note.created}</span>
		<span><ElapsedClock timestamp={note.created} /></span>
              {/if}
	    </div>
          </div>
        {/each}

      </div>

      <div class={pane2Class()} onscroll={handleScroll}>
        {#each recurringNotes() as note (note.id)}
          <div 
		class={noteClass()} 
		transition:fly={{ x: 200, duration: 500 }}
	  >
	    <div class="noteHeader"
		class:red={note.status === "urgent"}
		class:purple={note.status === "recurring"}
		class:green={note.status === "solved"}
            >
              <div class="noteMenu" class:menuFocused={note.id === menuFocused}>
                <div class="noteGreenButton" onclick={() => markSolved(note.id)}></div>
                <div class="noteRedButton" onclick={() => markUrgent(note.id)}></div>
                <div class="noteExitButton" onclick={() => exitNote(note.id)}></div>
              </div>
	    </div>
	    <div class="noteContent">
              {note.text}
	    </div>
	    <div class="noteFooter">
              {#if note.engineer}
                <span>{note.engineer}</span>
		<span>{note.created}</span>
		<span><ElapsedClock timestamp={note.created} /></span>
              {/if}
	    </div>
          </div>
        {/each}

      </div>

      <div class={pane3Class()} onscroll={handleScroll}>
        {#each solvedNotes() as note (note.id)}
          <div 
		class={noteClass()} 
		transition:fly={{ x: 200, duration: 500 }}
	  >
	    <div class="noteHeader"
		class:red={note.status === "urgent"}
		class:purple={note.status === "recurring"}
		class:green={note.status === "solved"}
            >
              <div class="noteMenu" class:menuFocused={note.id === menuFocused}>
                <div class="noteRedButton" onclick={() => deleteNote(note.id)}></div>
                <div class="noteExitButton" onclick={() => exitNote(note.id)}></div>
              </div>
	    </div>
	    <div class="noteContent">
              {note.text}
	    </div>
	    <div class="noteFooter">
              {#if note.engineer}
                <span>{note.engineer}</span>
		<span>{note.created}</span>
		<span><ElapsedClock timestamp={note.created} /></span>
              {/if}
	    </div>
          </div>
        {/each}

      </div>

    </div>
  </div>
</div>
<div class={inputPanelClass()}>
    <div class="row">
      <div class="menuButton" onclick={() => toggleMenu()}>
        {menuOpen ? '›' : '‹' }
      </div>
      {#if menuOpen}
        <div 
              class={menuElement(0)} 
              onclick={() => activePane(0)}
              transition:fly={{ x: 200, duration: 500 }}
        ></div>
        <div 
              class={menuElement(1)} 
              class:borderRed={menuOpen}
              onclick={() => activePane(1)}
              transition:fly={{ x: 200, duration: 500 }}
        ></div>
        <div 
              class={menuElement(2)} 
              class:borderPurple={menuOpen} 
              onclick={() => activePane(2)}
              transition:fly={{ x: 200, duration: 500 }}
        ></div>
        <div 
              class={menuElement(3)} 
              class:borderGreen={menuOpen} 
              onclick={() => activePane(3)}
              transition:fly={{ x: 200, duration: 500 }}
        ></div>
      {/if}
    </div>
  <div class="row">
  <textarea onfocus={handleFocus} onblur={handleBlur} value={message} oninput={(e) => (message = e.target.value)}></textarea>
  <div class={sendButtonClass()} onclick={() => sendMessage()}></div>
  </div>
<!--
  <div onclick={() => scrollDown()}>Down</div>
  <div onclick={() => scrollUp()}>Up</div>
-->
</div>
