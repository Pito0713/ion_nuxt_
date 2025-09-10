<template>
  <div v-if="editor" class="">
    <UButtonGroup class='mr-2 mb-2'> 
      <UButton 
        :variant="!editor.isActive('bold') ?  'outline': 'solid' "
        :disabled="!editor.can().chain().focus().toggleBold().run()" 
        :class="{ 'is-active': editor.isActive('bold') }"
        @click="editor.chain().focus().toggleBold().run()"
      >
        <UIcon name="codex:bold" class="size-6" />
      </UButton>
      <UButton 
        :variant="!editor.isActive('italic') ?  'outline': 'solid' "
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
        @click="editor.chain().focus().toggleItalic().run()"
      >
        <UIcon name="codex:italic" class="size-6" />
      </UButton>
      <UButton 
        :variant="!editor.isActive('strike') ?  'outline': 'solid' "  
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
        @click="editor.chain().focus().toggleStrike().run()"
      >
        <UIcon name="codex:strikethrough" class="size-6" />
      </UButton>
      <UButton 
        :variant="!editor.isActive('heading', { level: 1 }) ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
      >
        <UIcon name="codex:h1" class="size-6" />
      </UButton>
      <UButton 
        :variant="!editor.isActive('heading', { level: 2 }) ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
      >
        <UIcon name="codex:h2" class="size-6" />
      </UButton>
      <UButton 
        :variant="!editor.isActive('heading', { level: 3 }) ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
      >
        <UIcon name="codex:h3" class="size-6" />
      </UButton>
    </UButtonGroup>
    <UButtonGroup class='mr-2 mb-2'> 
      <UButton 
        :variant="!editor.isActive('code') ?  'outline': 'solid' "  
        :disabled="!editor.can().chain().focus().toggleCode().run()" 
        :class="{ 'is-active': editor.isActive('code') }"
        @click="editor.chain().focus().toggleCode().run()"
      >
        <UIcon name="codex:brackets" class="size-6" />
      </UButton>
      <UButton 
        :variant="!editor.isActive('codeBlock') ?  'outline': 'solid' "  
        :class="{ 'is-active': editor.isActive('codeBlock') }"
        @click="editor.chain().focus().toggleCodeBlock().run()"
      >
        <UIcon name="codex:curly-brackets" class="size-6" />
      </UButton>
       <UButton
        :variant="!editor.isActive('bulletList') ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive('bulletList') }"
        @click="editor.chain().focus().toggleBulletList().run()"
      >
        <UIcon name="codex:list-bulleted" class="size-6" />
      </UButton>
      <UButton 
        :variant="!editor.isActive('orderedList') ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive('orderedList') }"
        @click="editor.chain().focus().toggleOrderedList().run()"
      >
        <UIcon name="codex:list-numbered" class="size-6" />
      </UButton>
      <UButton 
        :variant="!editor.isActive('blockquote') ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive('blockquote') }"
        @click="editor.chain().focus().toggleBlockquote().run()"
      >
        <UIcon name="uim:align" class="size-6" />
      </UButton> 
    </UButtonGroup>
    <UButtonGroup class='mr-2 mb-2'> 
      <UButton
        :variant="!editor.isActive({ textAlign: 'left' }) ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
        @click="editor.chain().focus().setTextAlign('left').run()"
      >
        <UIcon name="codex:align-left" class="size-6" />
      </UButton>
      <UButton
        :variant="!editor.isActive({ textAlign: 'center' }) ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
        @click="editor.chain().focus().setTextAlign('center').run()"
      >
        <UIcon name="codex:align-center" class="size-6" />
      </UButton>
      <UButton
        :variant="!editor.isActive({ textAlign: 'right' }) ?  'outline': 'solid' " 
        :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
        @click="editor.chain().focus().setTextAlign('right').run()"      
      >
        <UIcon name="codex:align-right" class="size-6" />
      </UButton>
      <UButton 
        variant="outline"
        @click="editor.chain().focus().setHorizontalRule().run()">
        <UIcon name="codex:delimiter" class="size-6" />
      </UButton>
    </UButtonGroup>
    <UButtonGroup class='mr-2 mb-2'> 
      <UButton 
        variant="outline"
        :disabled="!editor.can().chain().focus().undo().run()"
        @click="editor.chain().focus().undo().run()" 
      >
        <UIcon name="codex:undo" class="size-6" />
      </UButton>
      <UButton 
        variant="outline"
        :disabled="!editor.can().chain().focus().redo().run()"
        @click="editor.chain().focus().redo().run()" 
      >
        <UIcon name="codex:redo" class="size-6" />
      </UButton>
    </UButtonGroup>
  </div>
  <editor-content :editor="editor" class="w-full" />
</template>

<script>
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Editor, EditorContent } from '@tiptap/vue-3'

export default {
  components: {
    EditorContent,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      editor: null,
    }
  },

  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value

      // JSON
      // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

      if (isSame) {
        return
      }

      this.editor.commands.setContent(value)
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        TextAlign.configure({
          types: ['heading', 'paragraph'],
        }),
      ],
      content: this.modelValue,
      onUpdate: () => {
        // HTML
        this.$emit('update:modelValue', this.editor.getHTML())

        // JSON
        // this.$emit('update:modelValue', this.editor.getJSON())
      },
    })
  },

  beforeUnmount() {
    this.editor.destroy()
  },
}
</script>