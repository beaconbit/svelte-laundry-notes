
<script>
	import { fly } from 'svelte/transition';
	import ElapsedClock from './ElapsedClock.svelte';

	let { note, deleteNote, markSolved, markUrgent, markRecurring } = $props();

</script>

<style>
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
    width: auto;
    border: 1px red solid;
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

</style>

<div 
      class="note" 
      transition:fly={{ x: 200, duration: 500 }}
>
  <div class="noteHeader"
      class:red={note.status === "urgent"}
      class:purple={note.status === "recurring"}
      class:green={note.status === "solved"}
  >
    <div class="noteMenu">
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
