<template>
  <div class="editor-container">
    <div ref="quillEditor" class="quill-editor"></div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
  name: 'QuillEditor',
  data() {
    return {
      quill: null,
    };
  },
  mounted() {
    this.quill = new Quill(this.$refs.quillEditor, {
      theme: 'snow',
      modules: {
        toolbar: [
          [{ 'font': [] }, { 'size': [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['direction', { 'align': [] }],
          ['link', 'image', 'video'],
          ['clean']
        ]
      }
    });
  },
  methods: {
    getEditorContent() {
      return this.quill.root.innerHTML;
    },
    setEditorContent(html) {
      this.quill.root.innerHTML = html;
    }
  }
};
</script>

<style scoped>
.editor-container {
  width: 100%;
  height: 400px;
}
.quill-editor {
  height: 100%;
}
</style>
