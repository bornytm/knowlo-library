<template>
    <div class='ed'>
        <template>
  <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
    <div>
      <button :class="{ 'is-active': true }" @click="commands.bold">
        Bold
      </button>
      <button :class="{ 'is-active': true }" @click="commands.heading({ level: 2 })">
        H2
      </button>
    </div>
  </editor-menu-bar>
</template>
    </div>
</template>

<script>
// Import the editor
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'

export default {
  components: {
    EditorContent,EditorMenuBar
  },
  data() {
    return {
      editor: null,
    }
  },
  mounted() {
    this.editor = new Editor({
      content: '<p>This is just a boring paragraph</p>',
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
<style scoped>
.ed {
    margin: 30px
}
</style>