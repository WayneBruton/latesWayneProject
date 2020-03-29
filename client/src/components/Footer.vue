<template>
  <!-- <div> -->
  <v-card height="80">
    <v-footer absolute class="font-weight-medium" color="#010a43" dark>
      <v-col class="text-center footer" cols="4">
        {{ new Date().getFullYear() }} — <strong>Perfect Staff</strong>
      </v-col>
      <v-col class="text-center footer" cols="4">
        <v-btn class="anchor" :to="{ name: 'privacypolicy' }" text
          >Privacy policy
        </v-btn>
      </v-col>
    </v-footer>
  </v-card>
  <!-- </div> -->
</template>

<style scoped>
.footer {
  font-size: 75%;
}
.anchor:hover {
  cursor: pointer;
}
</style>
