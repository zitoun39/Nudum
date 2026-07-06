import { Module } from "@nestjs/common";
import { LaboratoriesService } from "./laboratories.service";
import { LaboratoriesController } from "./laboratories.controller";
import { SamplesService } from "./samples.service";
import { SamplesController } from "./samples.controller";
import { AnalysesService } from "./analyses.service";
import { AnalysesController } from "./analyses.controller";
import { ResultsService } from "./results.service";
import { ResultsController } from "./results.controller";

@Module({
  controllers: [LaboratoriesController, SamplesController, AnalysesController, ResultsController],
  providers: [LaboratoriesService, SamplesService, AnalysesService, ResultsService],
  exports: [LaboratoriesService, SamplesService, AnalysesService, ResultsService]
})
export class JawdatiModule {}
