<template>
  <div class="about temp">
    <Pricing />
  </div>
</template>

<script>
import Pricing from "../components/Pricing";
export default {
  name: "pricing",
  metaInfo: {
    title: `PerfectStaff - Costs`,
    meta: [
      {
        name: `description`,
        content: `Staff Policies, remote work, telecommute`
      }
    ]
  },
  data() {
    return {};
  },
  components: {
    Pricing
  }
};
</script>
